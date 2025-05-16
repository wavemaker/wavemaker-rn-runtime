import { LocalDBManagementService } from './local-db-management.service';
import { LocalDBStore } from '../models/local-db-store';
import {forEach, get, mapKeys} from "lodash-es";


export class LocalDbService {
    static readonly SERVICE_NAME = 'LocalDbService';
    public searchTableData;
    public searchTableDataWithQuery;
    public getDistinctDataByFields;

    constructor(private localDBManagementService: LocalDBManagementService) {
        this.searchTableData = this.readTableData.bind(this);
        this.searchTableDataWithQuery = this.readTableData.bind(this);
        this.getDistinctDataByFields = this.readTableData.bind(this);
    }

    public async getStore(params: any): Promise<LocalDBStore> {
        return this.localDBManagementService.getStore(params.dataModelName, params.entityName);
    }

    /**
     * Method to insert data into the specified table. This modification will be added to offline change log.
     *
     * @param {object} params
     *                 Object containing name of the project & table data to be inserted.
     * @param {function=} successCallback
     *                    Callback function to be triggered on success.
     * @param {function=} failureCallback
     *                    Callback function to be triggered on failure.
     */
    public insertTableData(params: any, successCallback?: any, failureCallback?: any, options = {}) {
        this.getStore(params).then(store => {
            if (!store) {
                return Promise.reject("Store not found");
            }
            const isPKAutoIncremented = (store.primaryKeyField && store.primaryKeyField.column.generatorType === 'identity');
            if (get(options, 'resetPrimaryKey') !== false 
                && isPKAutoIncremented 
                && store.primaryKeyField 
                && params.data[store.primaryKeyField.name]) {
                delete params.data[store.primaryKeyField.name];
            }
            return store.add(params.data).then(() => {
                store.refresh(params.data).then(successCallback);
            });
        }).catch(failureCallback);
    }

    /**
     * Method to insert multi part data into the specified table. This modification will be added to offline change log.
     *
     * @param {object} params
     *                 Object containing name of the project & table data to be inserted.
     * @param {function=} successCallback
     *                    Callback function to be triggered on success.
     * @param {function=} failureCallback
     *                    Callback function to be triggered on failure.
     */
    public insertMultiPartTableData(params: any, successCallback?: any, failureCallback?: any, options = {}) {
        this.getStore(params).then(store => {
            if (!store) {
                return Promise.reject("Store not found");
            }
            store.serialize(params.data).then(data => {
                params.data = data;
                this.insertTableData(params, successCallback, failureCallback, options);
            });
            return;
        }).catch(failureCallback);
    }

    /**
     * Method to update data in the specified table. This modification will be added to offline change log.
     *
     * @param {object} params
     *                 Object containing name of the project & table data to be updated.
     * @param {function=} successCallback
     *                    Callback function to be triggered on success.
     * @param {function=} failureCallback
     *                    Callback function to be triggered on failure.
     */
    public updateTableData(params: any, successCallback?: any, failureCallback?: any) {
        this.getStore(params).then(store => {
            if (!store) {
                return Promise.reject("Store not found");
            }
            return store.save(params.data)
                .then(() => {
                    store.refresh(params.data).then(successCallback);
                });
        }).catch(failureCallback);
    }

    /**
     * Method to update multi part data in the specified table. This modification will be added to offline change log.
     *
     * @param {object} params
     *                 Object containing name of the project & table data to be updated.
     * @param {function=} successCallback
     *                    Callback function to be triggered on success.
     * @param {function=} failureCallback
     *                    Callback function to be triggered on failure.
     */
    public updateMultiPartTableData(params: any, successCallback?: any, failureCallback?: any)  {
        const data = (params.data && params.data.rowData) || params.data;
        this.getStore(params).then(store => {
            if (!store) {
                return Promise.reject("Store not found");
            }
            return store.save(data);
        }).then(() => {
            if (successCallback) {
                successCallback(data);
            }
        }).catch(failureCallback);
    }

    /**
     * Method to delete data in the specified table. This modification will be added to offline change log.
     *
     * @param {object} params
     *                 Object containing name of the project & table data to be inserted.
     * @param {function=} successCallback
     *                    Callback function to be triggered on success.
     * @param {function=} failureCallback
     *                    Callback function to be triggered on failure.
     */
    public deleteTableData(params: any, successCallback?: any, failureCallback?: any) {
        this.getStore(params).then(store => {
            if (!store) {
                return Promise.reject("Store not found");
            }
            const pkField = store.primaryKeyField,
                id = params[pkField.name] 
                    ?? params[pkField.column.name] 
                    ?? (params.data && params.data[pkField.name])
                    ?? params.id;
            return store.delete(id).then(successCallback);
        }).catch(failureCallback);
    }

    /**
     * Method to read data from a specified table.
     *
     * @param {object} params
     *                 Object containing name of the project & table data to be inserted.
     * @param {function=} successCallback
     *                    Callback function to be triggered on success.
     * @param {function=} failureCallback
     *                    Callback function to be triggered on failure.
     */
    public readTableData(params: any, successCallback?: any, failureCallback?: any) {
        this.getStore(params).then(store => {
            if (!store) {
                return Promise.reject("Store not found");
            }
            let filter = params.filter((filterGroup: any, filterFields: any) => {
                this.convertFieldNameToColumnName(store, filterGroup, filterFields);
            }, true);
            // convert wm_bool function with boolean value to 0/1
            filter = filter.replace(/wm_bool\('true'\)/g, 1).replace(/wm_bool\('false'\)/g, 0);
            return store.count(filter).then(totalElements => {
                const sort = params.sort.split('=')[1];
                return store.filter(filter, sort, {
                    offset: (params.page - 1) * params.size,
                    limit: params.size
                }).then(data => {
                    const totalPages = Math.ceil(totalElements / params.size);
                    successCallback({
                        'content'         : data,
                        'first'           : (params.page === 1),
                        'last'            : (params.page === totalPages),
                        'number'          : (params.page - 1),
                        'numberOfElements': data.length,
                        'size'            : params.size,
                        'sort'            : {
                            'sorted' : !!sort,
                            'unsorted' : !sort
                        },
                        'totalElements'   : totalElements,
                        'totalPages'      : totalPages
                    });
                });
            });
        }).catch(failureCallback);
    }

    private escapeName(name: string): string {
        if (name) {
            name = name.replace(/"/g, '""');
            return '"' + name.replace(/\./g, '"."') + '"';
        }
        return name;
    }

    // returns the columnName appending with the schema name.
    private getColumnName(store: LocalDBStore, fieldName: string) {
        if (store.fieldToColumnMapping[fieldName]) {
            const columnName = this.escapeName(store.fieldToColumnMapping[fieldName]);
            if (columnName.indexOf('.') < 0) {
                return this.escapeName(store.entityInfo.name) + '.' + columnName;
            }
            return columnName;
        }
        return fieldName;
    }

    private convertFieldNameToColumnName(store: LocalDBStore, filterGroup: any, options?: any) {
        forEach(filterGroup.rules, rule => {
            if (rule.rules) {
                this.convertFieldNameToColumnName(store, rule);
            } else {
                rule.target = this.getColumnName(store, rule.target);
            }
        });
        // handling the scenario where variable options can have filterField. For example: search filter query
        if (options && options.filterFields) {
            options.filterFields = mapKeys(options.filterFields, (v, k) => {
                return this.getColumnName(store, k);
            });
        }
    }
}
