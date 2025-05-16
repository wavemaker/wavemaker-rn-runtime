import * as SQLite from 'expo-sqlite';

import { SecurityService } from '@wavemaker/app-rn-runtime/core/security.service';
import { formatDate } from '@wavemaker/variables';

import { LocalKeyValueService } from './local-key-value.service';
import { LocalDBStore } from '../models/local-db-store';
import { escapeName } from '../utils/utils';
import { DataModel, EntityInfo, } from '../models/data.model';
import { DataType, NamedQueryInfo, PullType } from '../models/types';
import * as SystemProperties from '../models/system.properties';
import {
    find,
    forEach,
    isEmpty,
    isUndefined,
    map,
    now,
    replace,
    toString,
    isArray, assignIn
} from "lodash-es";
import moment from 'moment';
import { WAVEMAKER_DATABASE_SCHEMA } from '../models/wavemaker.schema';
import { DBSchema } from '../models/db-schema';
import formatters from '@wavemaker/app-rn-runtime/core/formatters';
import { bundleDirectory, copyAsync, deleteAsync, documentDirectory, makeDirectoryAsync, readAsStringAsync, readDirectoryAsync } from 'expo-file-system';
import EventNotifier from '@wavemaker/app-rn-runtime/core/event-notifier';

const NEXT_ID_COUNT = 'localDBStore.nextIdCount';
const META_LOCATION = 'www/metadata/app';


export enum EVENTS {
    DATABASE_CREATE = 'DATABASE_CREATE',
    AFTER_IMPORT = 'AFTER_IMPORT',
    BEFORE_EXPORT = 'BEFORE_EXPORT'
}

export class LocalDBManagementService {
    static readonly SERVICE_NAME = 'LocalDBManagementService'; 
    private dbInstallDirectoryName = 'databases';
    private dbInstallParentDirectory = documentDirectory;
    private dbInstallDirectory = `${this.dbInstallParentDirectory}${this.dbInstallDirectoryName}/`;
    private dataModels: {[name: string]: DataModel} = null as any;
    private _logSql = false;
    public nextId = 100000000000;
    public eventNotifier = new EventNotifier();
    public dbSeedCreationTime = Date.now();

    constructor(
        private appInfo: {
            name: string,
            packageName: string,
            versionNumber: string,
            versionCode: string
        },
        private file: File,
        private localKeyValueService: LocalKeyValueService,
        private securityService: SecurityService,
    ) {}

    /**
     * Closes all databases.
     *
     * @returns {object} a promise.
     */
    public close(): Promise<any> {
        return new Promise((resolve, reject) => {
            // Before closing databases, give some time for the pending transactions (if any).
            setTimeout(() => {
                const closePromises = Object.values(this.dataModels).map(db => db.sqliteObject.closeAsync());
                Promise.all(closePromises).then(resolve, reject);
            }, 1000);
        });
    }

    public nextIdCount() {
        this.nextId = this.nextId + 1;
        this.localKeyValueService.put(NEXT_ID_COUNT, this.nextId);
        return this.nextId;
    }

    private extractType = (typeRef: string): string => {
        let type;
        if (!typeRef) {
            return DataType.STRING;
        }
        type = typeRef && typeRef.substring(typeRef.lastIndexOf('.') + 1);
        type = type && type.toLowerCase();
        type = type === DataType.LOCALDATETIME ? DataType.DATETIME : type;
        return type;
    };

    private getSystemProperty(propertyName: string) {
        switch(propertyName) {
            case 'USER_ID':
                return {
                    name: 'USER_ID',
                    value: this.securityService.loggedInUser.userId
                }
            case 'USER_NAME':
                return {
                    name: 'USER_ID',
                    value: this.securityService.loggedInUser.userName
                }
            case 'DATE_TIME':
                return SystemProperties.DATE_TIME;
            case 'DATE':
                return SystemProperties.DATE;
            case 'TIME':
                return SystemProperties.TIME;
            
        }
        return SystemProperties.NONE;
    }

    /**
     * Executes a named query.
     *
     * @param {string} dbName name of database on which the named query has to be run
     * @param {string} queryName name of the query to execute
     * @param {object} params parameters required for query.
     * @returns {object} a promise.
     */
    public async executeNamedQuery(dbName: string, queryName: string, params: any) {
        let queryData: NamedQueryInfo;
        if (!this.dataModels[dbName] || !this.dataModels[dbName]?.queries[queryName]) {
            return Promise.reject(`Query by name ' ${queryName} ' Not Found`);
        }
        queryData = this.dataModels[dbName]?.queries[queryName];
        if (!queryData) {
            return;
        }
        await Promise.all(queryData.params
            .filter(p => p.variableType !== 'PROMPT')
            .map(async p => {
                params[p.name] = await (this.getSystemProperty(p.variableType || ''))?.value(p.name, params);
            }));
        params = queryData.params.map(p => {
            // Sqlite will accept DateTime value as below format.
            if (typeof params[p.name] !== 'string'
                && (p.type === DataType.DATETIME || p.type === DataType.LOCALDATETIME)) {
                return formatDate(params[p.name], p.type, formatters.get('toDate'));
            }
            // sqlite accepts the bool val as 1,0 hence convert the boolean value to number
            if (p.type === DataType.BOOLEAN) {
                return this.convertBoolToInt(params[p.name]);
            }
            return params[p.name];
        });
        const result = await this.executeSQLQuery(dbName, queryData.query, params);
        let firstRow: any,
            needTransform;
        if (!isEmpty(result.rows)) {
            firstRow = result.rows[0];
            needTransform = queryData.response.properties.filter((p: any) => !firstRow.hasOwnProperty(p.fieldName));
            if (!isUndefined(needTransform)) {
                result.rows = result.rows.map((row: any) => {
                    const transformedRow = {} as any,
                        rowWithUpperKeys = {} as any;
                    // This is to make search for data as case-insensitive
                    row.forEach((v: any, k: string) => rowWithUpperKeys[k.toUpperCase()] = v);
                    queryData.response.properties.forEach((p: any) => {
                        // format the value depending on the typeRef specified in properties.
                        const propType = this.extractType(p.fieldType.typeRef);
                        //const formatValue = DEFAULT_FORMATS[toUpper(propType)];
                        const fieldVal = row[p.name];
                        if (fieldVal && typeof fieldVal !== 'string'
                            && (propType === DataType.DATETIME || propType === DataType.LOCALDATETIME || propType === DataType.DATE)) {
                            if (moment(fieldVal).isValid()) {
                                row[p.name] = formatDate(fieldVal, propType, formatters.get('toDate'));
                            } else if (moment(fieldVal, 'HH:mm').isValid()) {
                                // if the value is in HH:mm:ss format, it returns a wrong date. So append the date to the given value to get date
                                row[p.name] = moment().format('YYYY-MM-DD') + 'T' + fieldVal;
                            }
                        }
                        if (propType === DataType.BOOLEAN) {
                            row[p.name] = this.convertIntToBool(fieldVal);
                        }
                        rowWithUpperKeys[p.nameInUpperCase] = row[p.name];
                        transformedRow[p.name] = row[p.name];
                        transformedRow[p.fieldName] = row[p.fieldName] || rowWithUpperKeys[p.nameInUpperCase];
                    });
                    return transformedRow;
                });
            }
        }
        return result;
    }

    /**
     *  returns store bound to the dataModelName and entityName.
     *
     * @param dataModelName
     * @param entityName
     * @returns {*}
     */
    public getStore(dataModelName: string, entityName: string): Promise<LocalDBStore> {
        if (!this.dataModels[dataModelName]) {
            return Promise.reject(`No database with ${dataModelName} is found.`);
        }
        const store = this.dataModels[dataModelName]?.stores[entityName];
        if (!store) {
            return Promise.reject(`No store with ${entityName} is found in datamodel ${dataModelName}.`)
        }
        return Promise.resolve(store);
    }

    /**
     * @param {string} dataModelName Name of the data model
     * @param {string} entityName Name of the entity
     * @param {string} operation Name of the operation (READ, INSERT, UPDATE, DELETE)
     * @returns {boolean} returns true, if the given operation can be performed as per configuration.
     */
    public async isOperationAllowed(dataModelName: string, entityName: string, operation: string): Promise<boolean> {
        try {
            const store = await this.getStore(dataModelName, entityName);
            if (!store) {
                return false;
            }
            if (operation === 'READ') {
                return store.entityInfo.pushConfig.readEnabled;
            }
            if (operation === 'INSERT') {
                return store.entityInfo.pushConfig.insertEnabled;
            }
            if (operation === 'UPDATE') {
                return store.entityInfo.pushConfig.updateEnabled;
            }
            if (operation === 'DELETE') {
                return store.entityInfo.pushConfig.deleteEnabled;
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    public async loadDatabases(): Promise<{[name: string]: DataModel}> {
        let newDatabasesCreated = false;
        if (this.dataModels) {
            return this.dataModels;
        }
        this.dataModels = {};
        newDatabasesCreated = await this.setUpDatabases();
        let metadata = await this.prepareDataModels();
        metadata = await this.loadNamedQueries(metadata);
        metadata = await this.loadOfflineConfig(metadata);
        await Promise.all(Object.values(metadata).map(async (dbMetadata) => {
            const database = await this.openDatabase(dbMetadata);
            this.dataModels[dbMetadata.schema.name] = database;
        }));
        const store = (await this.getStore('wavemaker', 'key-value'))!;
        this.localKeyValueService.init(store);
        this.nextId = (await this.localKeyValueService.get(NEXT_ID_COUNT)) || this.nextId;
        if (newDatabasesCreated) {
            await this.normalizeData();
            await this.disableForeignKeys();
            this.eventNotifier.notify(EVENTS.DATABASE_CREATE, [{
                'dataModels' : this.dataModels,
                'dbCreatedOn': now(),
                'dbSeedCreatedOn' : this.dbSeedCreationTime
            }]);
        }
        return this.dataModels;
    }

    public subscribe(event: EVENTS, fn: Function) {
        return this.eventNotifier.subscribe(event, fn);
    }

    public setLogSQl(flag: boolean) {
        this._logSql = flag;
    }

    /**
     * Deletes any existing databases (except wavemaker db) and copies the databases that are packaged with the app.
     *
     * @returns {*}
     */
    private async cleanAndCopyDatabases(): Promise<any> {
        const dbSeedFolder = bundleDirectory + META_LOCATION;
        await makeDirectoryAsync(this.dbInstallParentDirectory + this.dbInstallDirectoryName).catch(() => {});
        await Promise.all(
            (await readDirectoryAsync(this.dbInstallDirectory))
                .filter(f => /.+\.db$/.test(f) || f !== 'wavemaker.db')
                .map(f => deleteAsync(this.dbInstallDirectory + f)));
        (await readDirectoryAsync(dbSeedFolder))
            .filter(f => /.+\.db$/.test(f))
            .map(f => copyAsync({
                from: dbSeedFolder + f,
                to: this.dbInstallDirectory + f
            }));
    }


    // Loads necessary details of queries
    private compactQueries(queriesByDB: any): {[name: string]: NamedQueryInfo} {
        const queries = {} as {[name: string]: NamedQueryInfo};

        queriesByDB.queries?.forEach((queryData: any) => {
            let query: any, params: any;
            if (queryData.nativeSql && queryData.type === 'SELECT') {
                query = isEmpty(queryData.offlineQueryString) ? queryData.queryString : queryData.offlineQueryString;
                params = map(this.extractQueryParams(query), p => {
                    const paramObj = find(queryData.parameters, {'name': p});
                    return {
                        name: paramObj.name,
                        type: paramObj.type,
                        variableType: paramObj.variableType
                    };
                });
                params.forEach((p: any) => query = replace(query, ':' + p.name, '?'));
                queries[queryData.name] = {
                    name: queryData.name,
                    query: query,
                    params: params,
                    response: {
                        properties: queryData.response?.properties?.map((p: any) => {
                            p.nameInUpperCase = p.name.toUpperCase();
                            return p;
                        })
                    }
                };
            }
        });
        return queries;
    }

    // Loads necessary details of remote schema
    private prepareDataModel(schema: DBSchema): DataModel {
        const dbInfo = new DataModel();
        const transformedSchemas = {} as {[name: string]: EntityInfo};
        Object.values(schema.tables).forEach((table) => {
            transformedSchemas[table.entityName] = new EntityInfo(table);
        });
        Object.values(schema.tables).forEach((table) => {
            table.relations?.forEach(r => {
                const entity = transformedSchemas[table.entityName];
                const relatedTo = transformedSchemas[r.target.table.entityName];
                if (relatedTo && entity) {
                    const field = entity.fields.find(f => f.name === r.source.fieldName);
                    if (field) {
                        entity.addRelation(field, relatedTo);
                    }
                }
            });
            transformedSchemas[table.entityName] = new EntityInfo(table);
        });
        dbInfo.schema.name = schema.name;
        dbInfo.schema.isInternal = schema.isInternal;
        dbInfo.schema.entities = transformedSchemas;
        return dbInfo;
    }

    private convertBoolToInt(bool: boolean) {
        return toString(bool) === 'true' ? 1 : 0;
    }

    private convertIntToBool(int: number) {
        return int ? true : false;
    }

    /**
     * Turns off foreign keys
     * @returns {*}
     */
    private disableForeignKeys() {
        // @ts-ignore
        return Promise.all(map(this.dataModels, db => this.executeSQLQuery(db.schema.name, 'PRAGMA foreign_keys = OFF')));
    }

    /**
     * Executes SQL query;
     *
     * @param dbName
     * @param sql
     * @param params
     * @returns {*}
     */
    public async executeSQLQuery(dbName: string, sql: string, params?: any, logOutput?: boolean) {
        const db = this.dataModels[dbName];
        if (db) {
            const result: SQLite.SQLiteExecuteAsyncResult<any> = await (db.sqliteObject as any).executeSQLWithParams(sql, params, logOutput);
            const data = [];
            const rows = await result.getAllAsync();
            for (let i = 0; i < rows.length; i++) {
                data.push(rows[i]);
            }
            return {
                'rowsAffected'  : result.changes,
                'rows'          : data,
                'result'        : result
            };
        }
        throw new Error(`No Database with name ${dbName} found`);
    }

    // get the params of the query or procedure.
    private extractQueryParams(query: string) {
        let params, aliasParams;
        aliasParams = query.match(/[^"'\w\\]:\s*\w+\s*/g) || [];
        if (aliasParams.length) {
            params = aliasParams.map(x => (/[=|\W]/g.test(x)) ? x.replace(/\W/g, '').trim() : x.trim());
        } else {
            params = null;
        }
        return params;
    }


    /**
     * Searches for the files with given regex in 'www/metadata/app'and returns an array that contains the JSON
     * content present in each file.
     *
     * @param {string} fileNameRegex regex pattern to search for files.
     * @returns {*} A promise that is resolved with an array
     */
    private async getMetaInfo(fileNameRegex: RegExp) {
        const folder = bundleDirectory + META_LOCATION + '/';
        const files = await readDirectoryAsync(folder);
        return await Promise.all(files.filter(f => fileNameRegex.test(f)).map(f => {
            return  readAsStringAsync(folder + f);
        }));
    }

    /**
     * Returns true, if the given entity's data is bundled along with application installer.
     * @param dataModelName name of the data model
     * @param entityName name of the entity
     * @returns {Promise<any>}
     */
    public async isBundled(dataModelName: string, entityName: string): Promise<any> {
        const store = await this.getStore(dataModelName, entityName);
        return store?.entityInfo.pullConfig.pullType === PullType.BUNDLED;
    }

    /**
     * Loads local database schemas from *_data_model.json.
     *
     * @returns {*} A promise that is resolved with metadata.
     */
    private async prepareDataModels(): Promise<{[name: string]: DataModel}> {
        let schemas: any = await this.getMetaInfo(/.+_dataModel\.json$/);
        const metadata = {} as {[name: string]: DataModel};
        schemas = isArray(schemas) ? schemas : [schemas];
        schemas.push(WAVEMAKER_DATABASE_SCHEMA);
        schemas.map((s: any) => this.prepareDataModel(s))
            .forEach((s: any) =>  {
                metadata[s.schema.name, s];
            });
        return metadata;
    }

    /**
     * Load named queries from *_query.json.
     *
     * @param {*} metadata
     * @returns {*} A promise that is resolved with metadata
     */
    private async loadNamedQueries(metadata: any) {
        let queriesByDBs = await this.getMetaInfo(/.+_query\.json$/);
        queriesByDBs = isArray(queriesByDBs) ? queriesByDBs : [queriesByDBs];
        queriesByDBs.map((e: any) => metadata[e.name].queries = this.compactQueries(e));
        return metadata;
    }

    /**
     * Load offline configuration from *_offline.json.
     *
     * @param {*} metadata
     * @returns {*} A promise that is resolved with metadata
     */
    private async loadOfflineConfig(metadata: any) {
        const configs = await this.getMetaInfo(/.+_offline\.json$/);
        configs.forEach((config: any) => {
            // @ts-ignore
            forEach(config.entities, entityConfig => {
                // @ts-ignore
                const entitySchema = find(metadata[config.name].schema.entities, schema => schema.name === entityConfig.name);
                assignIn(entitySchema, entityConfig);
            });
        });
        return metadata;
    }

    private logSql(sqliteObject: SQLite.SQLiteDatabase) {
        const logger = console;
        (sqliteObject as any).executeSQLWithParams = async (sql: string, params: any, logOutput?: boolean) => {
            try {
                const startTime = now();
                const statement = await sqliteObject.prepareAsync(sql);
                const result = await statement.executeAsync(params);
                const rows = await result.getAllAsync();
                if (logOutput || this._logSql) {
                    const objArr = [],
                        rowCount = rows.length;
                    for (let i = 0; i < rowCount; i++) {
                        objArr.push(rows[i]);
                    }
                    logger.debug('SQL "%s"  with params %O took [%d ms]. And the result is %O', sql, params, now() - startTime, objArr);
                }
                return result;
            } catch(error) {
                logger.error('SQL "%s" with params %O failed with error message %s', sql, params, ((error as any)?.message || error));
                return Promise.reject(error);
            }
        };
    }

    /**
     * SQLite does not support boolean data. Instead of using boolean values, data will be changed to 0 or 1.
     * If the value is 'true', then 1 is set as value. If value is not 1 nor null, then column value is set as 0.
     * @param dbName
     * @param tableName
     * @param colName
     * @returns {*}
     */
    private async normalizeBooleanData(dbName: string, tableName: string, colName: string) {
        const trueTo1Query = `update ${escapeName(tableName)} set ${escapeName(colName)} = 1 where ${escapeName(colName)} = 'true'`,
            exceptNullAnd1to0Query = `update ${escapeName(tableName)} set ${escapeName(colName)} = 0
                                  where ${escapeName(colName)} is not null and ${escapeName(colName)} != 1`;
        await this.executeSQLQuery(dbName, trueTo1Query)
        return this.executeSQLQuery(dbName, exceptNullAnd1to0Query);
    }

    /**
     * Converts data to support SQLite.
     * @returns {*}
     */
    private async normalizeData() {
        return Promise.all(Object.values(this.dataModels).map(database => {
            return Promise.all(Object.values(database.schema.entities).map(entitySchema => {
                return Promise.all(entitySchema.fields.map(async (field) => {
                    if (field.column.sqlType === 'boolean') {
                        return this.normalizeBooleanData(database.schema.name, entitySchema.name, field.column.name);
                    }
                    return null;
                }));
            }));
        }));
    }

    private async openDatabase(database: DataModel) {
        const sqliteObject = await SQLite.openDatabaseAsync(database.schema.name + '.db', {}, this.dbInstallDirectory);
        database.sqliteObject = sqliteObject;
        this.logSql(sqliteObject);
        const stores = await Promise.all(Object.values(database.schema.entities).map(entitySchema => {
            // @ts-ignore
            const store = new LocalDBStore(
                entitySchema,
                () => this.nextIdCount(),
                async (dbName: string, sql: string, logOutput?: boolean) => {
                    return (await this.executeSQLQuery(dbName, sql, logOutput)).result;
                }
            );
            return store.create();
        }));
        stores.forEach(store => {
            (database.stores as any)[store.entitySchema.entityName] = store;
        });
        return database;
    }

    /**
     * When app is opened for first time  after a fresh install or update, then old databases are removed and
     * new databases are created using bundled databases.
     *
     * @returns {*} a promise that is resolved with true, if the databases are newly created or resolved with false
     * if existing databases are being used.
     */
    // private setUpDatabases(): Promise<boolean> {
    //     return this.deviceService.getAppBuildTime()
    //         .then((buildTime) => {
    //             const dbInfo = this.deviceService.getEntry('database') || {};
    //             if (!dbInfo.lastBuildTime || dbInfo.lastBuildTime !== buildTime) {
    //                 return this.cleanAndCopyDatabases()
    //                     .then(() => {
    //                         dbInfo.lastBuildTime = buildTime;
    //                         return this.deviceService.storeEntry('database', dbInfo);
    //                     }).then(() => true);
    //             }
    //             return false;
    //         });
    // }

    private setUpDatabases(): Promise<boolean> {
        return this.cleanAndCopyDatabases();
    }
}
