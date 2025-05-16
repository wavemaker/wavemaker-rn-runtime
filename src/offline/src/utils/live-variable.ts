import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';

import { LocalDBStore } from '../models/local-db-store';
import { ChangeLogService } from '../services/change-log.service';
import { LocalDBManagementService } from '../services/local-db-management.service';
import { LocalDbService } from '../services/local-db.service';
import { WM_LOCAL_OFFLINE_CALL } from './utils';
import { clone, cloneDeep, find, isArray, isObject, reject } from "lodash-es";
import { LiveVariable, LiveVariableConfig } from '@wavemaker/app-rn-runtime/variables/live-variable';
import { HttpService } from '@wavemaker/app-rn-runtime/variables/http.service';

const apiConfiguration = [{
        'name' : 'insertTableData',
        'type' : 'INSERT'
    }, {
        'name' : 'insertMultiPartTableData',
        'type' : 'INSERT'
    }, {
        'name' : 'updateTableData',
        'type' : 'UPDATE'
    }, {
        'name' : 'updateMultiPartTableData',
        'type' : 'UPDATE'
    }, {
        'name' : 'deleteTableData',
        'type' : 'DELETE'
    }, {
        'name' : 'readTableData',
        'type' : 'READ',
        'saveResponse': true
    }, {
        'name' : 'searchTableData',
        'type' : 'READ',
        'saveResponse': true
    }, {
        'name' : 'searchTableDataWithQuery',
        'type' : 'READ',
        'saveResponse': true
    }, {
        'name' : 'getDistinctDataByFields',
        'type' : 'READ',
        'saveResponse': false
    }];

interface CrudParams {
    dataModelName: string;
    entityName: string;
    operation: 'searchTableDataWithQuery' | 'insertTableData' | 'updateTableData';
    page: number;
    size: number;
    sort: string;
    data: any;
    onlyOnline?: boolean;
    skipLocalDB?: boolean;
    isCascadingStopped?: boolean;
    hasBlob?: boolean;
    url: string;
}

interface Cascader {
    cascade: () => Promise<any>;
}

export class LiveVariableWithOfflineBehaviour extends LiveVariable {
    
    private changeLogService: ChangeLogService = null as any;
    private localDBManagementService: LocalDBManagementService = null as any;
    private networkService = NetworkService;
    private remoteHttpService: HttpService; 
    private offlineDBService: LocalDbService = null as any;


    constructor(public config: LiveVariableConfig) {
        super(config);
        this.remoteHttpService = this.httpService;
        this.httpService = (new Proxy(this.httpService, {
            get: (target, prop, receiver): any => {
                if (prop.toString() === 'sendCall') {
                    return this.handleSend.bind(this);
                }
                return Reflect.get(target, prop, receiver);
            },
            set: (target: any, prop, value: any): any => {
                return Reflect.set(target, prop, value);
            }
        }));
    }

    private async loadDataFromRemote(params: CrudParams) {
        return this.networkService.isConnected() 
            || params.onlyOnline 
            || !params.dataModelName 
            || !params.entityName
            || !this.operation 
            || (await (this.localDBManagementService.isOperationAllowed(
                    params.dataModelName,
                    params.entityName,
                    this.operation)));
    }

    private async handleSend(reqParams: any, variable: LiveVariable, params: CrudParams) {
        if (await this.loadDataFromRemote(params)) {
            return this.remoteDBcall(reqParams, variable, params);
        }
        let cascader: Cascader | undefined = undefined;; 
        if (!params.isCascadingStopped &&
            (params.operation === 'insertTableData'
                || params.operation === 'updateTableData')) {
            cascader = await this.prepareToCascade(params);
        }
        const response = await this.localDBcall(params);
        if (cascader) {
            await cascader.cascade();
            const store = (await this.getStore(params))!;
            const data = await store.refresh(response.body);
            // data includes parent and child data.
            if (response && response.body) {
                response.body = data;
            }
        }
        return response;
    }

    public getStore(params: CrudParams) {
        return this.localDBManagementService.getStore(params.dataModelName, params.entityName)!;
    }

    // set hasBlob flag on params when blob field is present
    private hasBlob(store: LocalDBStore) {
        const blobColumns = Object.values(store.entityInfo.table.columns)
            .filter(c => c.sqlType === 'blob');
        return !!blobColumns.length;
    }

    /*
     * During offline, LocalDBService will answer to all the calls. All data modifications will be recorded
     * and will be reported to DatabaseService when device goes online.
     */
    private async localDBcall(params: CrudParams): Promise<any> {
        const operation = (find(apiConfiguration, {name: params.operation})!);
        const response = await new Promise<any>((resolve) => {
            ((this.offlineDBService as any)[operation?.name] as any)(
                params, 
                resolve, 
                reject);
        });
        if (operation.type === 'READ') {
            return response;
        }
        // add to change log
        params.onlyOnline = true;
        await this.changeLogService.add('DatabaseService', operation.name, params)
        return {body : response, type: WM_LOCAL_OFFLINE_CALL};
    }

    /*
     * During online, all read operations data will be pushed to offline database. Similarly, Update and Delete
     * operations are synced with the offline database.
     */
    private async remoteDBcall(reqParams: any, variable: LiveVariable, params: CrudParams): Promise<any> {
        const operation = (find(apiConfiguration, {name: params.operation})!);
        const response: any  = await this.remoteHttpService.sendCall(reqParams, variable);
        if (response && response.type && !params.skipLocalDB) {
            const store = await this.offlineDBService.getStore(params);
            if (operation.type === 'READ' && operation.saveResponse) {
                store?.saveAll(response.body.content);
            } else if (operation.type === 'INSERT') {
                params = clone(params);
                params.data = clone(response.body);
                await (this.offlineDBService as any)[operation.name](params, undefined, undefined, {
                    resetPrimaryKey: false
                });
            } else {
                await(this.offlineDBService as any)(params);
            }
        }
        return response;
    }

    /**
     * Finds out the nested objects to save and prepares a cloned params.
     */
    private async prepareToCascade(params: CrudParams): Promise<Cascader> {
        const store = (await this.getStore(params))!;
        const childCascaderList = await Promise.all(Object.keys(params.data)
            .filter(async (k) => {
                let v = params.data[k],
                relation = store.entityInfo.table.relations.find(r => r.name === k);
                // NOTE: Save only one-to-one relations for cascade
                return relation && isObject(v) && !isArray(v);
            }).map(async (k) => {
                let v = params.data[k],
                relation = store.entityInfo.table.relations.find(r => r.name === k)!,
                childParams = cloneDeep(params);
                childParams.entityName = relation.target.table.entityName;
                childParams.data = v;
                const childStore = (await this.getStore(childParams))!;
                const parent = params.data;
                const parentField = childStore?.entityInfo.table.relations
                    .find(cr => cr.target === relation.source)?.source;
                if (parentField) {
                    childParams.data[parentField.fieldName] = parent;
                }
                parent[k] = null;
                childParams.onlyOnline = false;
                childParams.isCascadingStopped = true;
                childParams.hasBlob = this.hasBlob(childStore);
                childParams.url = '';
                return async () => {
                    const primaryKeyValue = childStore.getValue(childParams.data, childStore.primaryKeyField);
                    const object =  primaryKeyValue ? (await childStore.get(primaryKeyValue)) : null
                    let operation;
                    if (object) {
                        operation = childParams.hasBlob ? 'updateMultiPartTableData' : 'updateTableData';
                    } else {
                        operation = childParams.hasBlob ? 'insertMultiPartTableData' : 'insertTableData';
                    }
                    return (this.remoteHttpService as any)[operation](childParams).toPromise();
                };
            })
        );
        return {
            cascade: () => Promise.all(childCascaderList.map(fn => fn()))
        }
    }
}
