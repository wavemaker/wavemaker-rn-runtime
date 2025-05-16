import { Change, FlushContext, Worker } from './../change-log.service';
import { LocalDBManagementService } from './../local-db-management.service';
import { LocalDBStore } from './../../models/local-db-store';
import { isUndefined } from 'lodash-es';

const STORE_KEY  = 'idConflictResolution';

/**
 * In offline database, a insert could generate the Id of an entity. During flush, id of that entity might get changed.
 * Due to that, relationship inconsistency arises. To prevent that, wherever this entity is referred in the next flush
 * call, Id has to be replaced with that of new one.
 */
export class IdResolver implements Worker {

    private idStore : {
        [dataModelName: string]: {
            [entityName: string]: {
                [localId: string | number ]: [remoteId: string | number ]
            }
        };
    } = {};
    private logger;
    private transactionLocalId: string | number | undefined = undefined;

    constructor(private localDBManagementService: LocalDBManagementService) {
        this.logger = window.console;
    }

    public preFlush(context: FlushContext) {
        this.idStore = context.get(STORE_KEY);
    }

    // Exchane Ids, Before any database operation.
    public async preCall(change: Change, store?: LocalDBStore) {
        if (change && change.service === 'DatabaseService') {
            store = store!;
            const entityName = change.params.entityName;
            const dataModelName = change.params.dataModelName;
            switch (change.operation) {
                case 'insertTableData':
                case 'insertMultiPartTableData':
                    change.params.skipLocalDB = true ;
                    const primaryKeyName = store.primaryKeyField.name;
                    if (primaryKeyName) {
                        this.transactionLocalId = change.params.data[primaryKeyName];
                        change.dataLocalId = this.transactionLocalId!;
                    }
                    await this.exchangeIds(store, dataModelName, entityName, change.params.data);
                    if (store.primaryKeyField && store.primaryKeyField.column.generatorType === 'identity') {
                        delete change.params.data[primaryKeyName];
                    } else {
                        const relationalPrimaryKeyValue = store.getValue(change.params.data, store.primaryKeyField);
                        // for the data referring to the relational table based on primary key assign the primaryField values to the relationalPrimaryKeyValue
                        if (!isUndefined(relationalPrimaryKeyValue)) {
                            change.params.data[primaryKeyName] = relationalPrimaryKeyValue;
                            if (!isUndefined(this.transactionLocalId)) {
                                this.pushIdToStore(dataModelName, entityName, this.transactionLocalId, relationalPrimaryKeyValue);
                            }
                        }
                        this.transactionLocalId = undefined;
                    }
                    break;
                case 'updateTableData':
                case 'updateMultiPartTableData':
                case 'deleteTableData':
                    // on update call, passing id to exchangeId as change.params id(local value 10000000+) is not updated with the latest id from db
                    this.exchangeId(store!, dataModelName, entityName, change.params, 'id');
                    if (change.params.data) {
                        return this.exchangeIds(store!, dataModelName, entityName, change.params.data);
                    }
            }
        }
    }
    // After every database insert, track the Id change.
    public async postCallSuccess(change: Change, response: any, store?: LocalDBStore) {
        if (change && change.service === 'DatabaseService'
            && (change.operation === 'insertTableData' || change.operation === 'insertMultiPartTableData')
            && this.transactionLocalId) {
            store = store!;
            const data = response[0].body;
            const entityName = change.params.entityName;
            const dataModelName = change.params.dataModelName;
            this.pushIdToStore(dataModelName, entityName, this.transactionLocalId, data[store.primaryKeyField.name]);
            await store.delete(this.transactionLocalId).catch(() => {});
            this.transactionLocalId = undefined;
            await store.save(data);
        }
    }
    // store error entity id
    public postCallError(change: Change, store?: LocalDBStore) {
        if (change && change.service === 'DatabaseService'
            && (change.operation === 'insertTableData' 
                || change.operation === 'insertMultiPartTableData')
            && this.transactionLocalId) {
            store = store!;
            change.params.data[store.primaryKeyField.name] = this.transactionLocalId;
        }
    }

    private getEntityIdStore(dataModelName: string, entityName: string) {
        this.idStore[dataModelName] = this.idStore[dataModelName] || {};
        this.idStore[dataModelName][entityName] = this.idStore[dataModelName][entityName] || {};
        return this.idStore[dataModelName][entityName];
    }

    // if local id is different, then create a mapping for exchange.
    private pushIdToStore(dataModelName: string, entityName: string, transactionLocalId: any, remoteId: any) {
        if (transactionLocalId !== remoteId) {
            this.getEntityIdStore(dataModelName, entityName)[transactionLocalId] = remoteId;
            this.logger.debug('Conflict found for entity (%s) with local id (%i) and remote Id (%i)', entityName, transactionLocalId, remoteId);
        }
    }

    private logResolution(entityName: string, localId: any, remoteId: any) {
        this.logger.debug('Conflict resolved found for entity (%s) with local id (%i) and remote Id (%i)', entityName, localId, remoteId);
    }

    // Exchange primary key  of the given entity
    private exchangeId(store: LocalDBStore, dataModelName: string, entityName: string, data?: any, keyName?: string) {
        const primaryKeyName = keyName || store.primaryKeyField.name;
        const entityIdStore = this.getEntityIdStore(dataModelName, entityName);
        if (data && primaryKeyName) {
            const localId = data[primaryKeyName];
            let remoteId = localId;
            while (entityIdStore[remoteId]) {
                remoteId = entityIdStore[remoteId];
            }
            if (remoteId !== localId) {
                data[primaryKeyName] = remoteId;
                this.logResolution(entityName, localId, remoteId);
            }
        }
    }

    // Looks primary key changes in the given entity or in the relations
    private exchangeIds(store: LocalDBStore, dataModelName: string, entityName: string, data: any): Promise<any> {
        this.exchangeId(store, dataModelName, entityName, data);
        const exchangeIdPromises: Promise<any>[] = [];
        store.entityInfo.table.relations.forEach(r => {
            if (data[r.source.fieldName]) {// if id value
                this.exchangeId(store, dataModelName, r.target.table.entityName, data, r.source.fieldName);
            }
            if (data[r.source.fieldName]) {// if object reference
                exchangeIdPromises.push(this.localDBManagementService.getStore(dataModelName, r.target.table.entityName)
                    .then(refStore => {
                        return this.exchangeIds(refStore!, dataModelName, r.target.table.entityName, data[r.source.fieldName]);
                    }));
            }
        });
        return Promise.all(exchangeIdPromises);
    }
}
