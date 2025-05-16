import * as SQLite from 'expo-sqlite';

import { EntityInfo, FieldInfo } from './data.model';
import { escapeName } from '../utils/utils';
import { isEmpty, isNil, isString, trim } from "lodash-es";

export interface FilterCriterion {
    attributeName: string;
    attributeValue: any;
    attributeType: string;
    filterCondition: string;
}

export interface Pagination {
    offset: number;
    limit: number;
}

const insertRecordSqlTemplate = (entityInfo: EntityInfo) => {
    const columnNames: string[] = [],
        placeHolder: string[] = [];
    Object.values(entityInfo.table.columns).forEach(col => {
        columnNames.push(escapeName(col.name));
        placeHolder.push('?');
    });
    return `INSERT INTO ${escapeName(entityInfo.name)} (${columnNames.join(',')}) VALUES (${placeHolder.join(',')})`;
};

const replaceRecordSqlTemplate = (entityInfo: EntityInfo) => {
    const columnNames: string[] = [],
        placeHolder: string[] = [];
    Object.values(entityInfo.table.columns).forEach(col => {
        columnNames.push(escapeName(col.name));
        placeHolder.push('?');
    });
    return `REPLACE INTO ${escapeName(entityInfo.name)} (${columnNames.join(',')}) VALUES (${placeHolder.join(',')})`;
};

const deleteRecordTemplate = (entityInfo: EntityInfo) => {
    const primaryKeyField = entityInfo.primaryKey;
    if (primaryKeyField) {
        return `DELETE FROM ${escapeName(entityInfo.name)} WHERE ${escapeName(primaryKeyField.name)} = ?`;
    }
    return '';
};

const buildJoinStatements = (entity: EntityInfo) => {
    const joins: string[] = [];
    entity.fields
        .filter(f => f.relatedEntity)
        .forEach(f => {
            const sourceTableName = escapeName(f.entity.table.name);
            const sourceColumnName = escapeName(f.column.name);
            const sourceFieldName = f.name;
            const targetTableName = escapeName(f.relatedEntity!.table.name);
            const targetColumnName = escapeName(f.relatedEntity!.primaryKey!.name);
            joins.push(` LEFT JOIN ${targetTableName} ${sourceFieldName}  
                        ON ${sourceTableName}.${sourceColumnName} = ${sourceFieldName}.${targetColumnName}`);
        });
    return joins;
}

const selectSqlTemplate = (entityInfo: EntityInfo) => {
    const columns = [] as string[],
        joins: string[] = buildJoinStatements(entityInfo);
    entityInfo.fields.forEach(field => {
        columns.push(escapeName(entityInfo.name) + '.' + escapeName(field.column.name) + ' as ' + field.name);
        if (field.relatedEntity) {
            field.relatedEntity.fields.forEach(rField => {
                const childFieldName = `${field.name}.${rField.name}`;
                columns.push(field.name + '.' + escapeName(rField.column.name) + ' as \'' + childFieldName + '\'');
            });
        }
    });
    return `SELECT ${columns.join(',')} FROM ${escapeName(entityInfo.name)} ${joins.join(' ')}`;
};

const countQueryTemplate = (entityInfo: EntityInfo) => {
    const joins = buildJoinStatements(entityInfo);
    return `SELECT count(*) as count FROM ${escapeName(entityInfo.name)} ${joins.join(' ')}`;
};

const generateWherClause = (store: LocalDBStore, filterCriteria?: FilterCriterion[]) => {
    let conditions;
    const fieldToColumnMapping = store.fieldToColumnMapping,
        tableName = store.entityInfo.name;
    if (!isEmpty(filterCriteria) && isString(filterCriteria)) {
        return ' WHERE ' + filterCriteria;
    }
    if (filterCriteria) {
        conditions = filterCriteria.map(filterCriterion => {
            const colName = fieldToColumnMapping[filterCriterion.attributeName],
                condition = filterCriterion.filterCondition;
            let target = filterCriterion.attributeValue,
                operator = '=';
            if (filterCriterion.attributeType === 'STRING') {
                if (condition === 'STARTING_WITH') {
                    target = target + '%';
                    operator = 'like';
                } else if (condition === 'ENDING_WITH') {
                    target = '%' + target;
                    operator = 'like';
                } else if (condition === 'CONTAINING') {
                    target = '%' + target + '%';
                    operator = 'like';
                }
                target = `'${target}'`;
            } else if (filterCriterion.attributeType === 'BOOLEAN') {
                target = (target === true ? 1 : 0);
            }
            return `${escapeName(tableName)}.${escapeName(colName)} ${operator} ${target}`;
        });
    }
    return conditions && conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
};

const generateOrderByClause = (store: LocalDBStore, sort?: string) => {
    if (sort) {
        return ' ORDER BY ' + sort.split(',').map(field => {
            const splits = trim(field).split(' ');
            splits[0] = escapeName(store.entityInfo.name) + '.' + escapeName(store.fieldToColumnMapping[splits[0]]);
            return splits.join(' ');
        }).join(',');
    }
    return '';
};

const geneateLimitClause = (page? : {offset: number, limit: number}) => {
    page = Object.assign({limit: 100, offset: 0}, page);
    return ' LIMIT ' + page.limit + ' OFFSET ' + 0;
};

const mapRowDataToObj = (entityInfo: EntityInfo, dataObj: any) => {
    entityInfo.fields.forEach(field => {
        const val = dataObj[field.name];
        if (field.relatedEntity) {
            let childEntity = null as any;
            field.relatedEntity.fields.forEach(rField => {
                const childFieldName = `${field.name}.${rField.name}`;
                const value = dataObj[childFieldName] ?? '';
                if (value) {
                    childEntity = childEntity || {};
                    childEntity[rField.name] = value;
                }
                delete dataObj[childFieldName];
            });
            dataObj[field.name] = childEntity;
        } else if (field.column.sqlType === 'boolean' && !isNil(val)) {
            dataObj[field.name] = (val === 1);
        }
    });
    return dataObj;
};

const getValue = (entity: any, field: FieldInfo) => {
    let value = entity[field.name];
    if (field.relatedEntity) {
        value = (entity[field.name] as any)[field.relatedEntity.primaryKey?.name || ''];
    }
    if (isNil(value)) {
        return field.column.defaultValue;
    } else if (field.column.sqlType === 'boolean') {
        return (value === true ? 1 : 0);
    } else {
        return value;
    }
};

const mapObjToRow = (store: LocalDBStore, entity: any) => {
    const row = {} as any;
    store.entityInfo.fields.forEach(field => row[field.column.name] = getValue(entity, field));
    return row;
};

export class LocalDBStore {

    public readonly primaryKeyField: FieldInfo;
    public readonly fieldToColumnMapping = {} as any;

    private insertRecordSqlTemplate: string;
    private replaceRecordSqlTemplate: string;
    private deleteRecordTemplate: string;
    private selectSqlTemplate: string;
    private countQuery: string;

    constructor(
        public readonly entityInfo: EntityInfo,
        public readonly nextId = () => 0,
        public readonly executeSQL = async (query: string, params?: any): Promise<SQLite.SQLiteExecuteAsyncResult<any>> =>  Promise.resolve(null as any)
    ) {
        this.primaryKeyField = this.entityInfo.primaryKey!;
        this.entityInfo.fields.forEach(f => {
            this.fieldToColumnMapping[f.name] = f.column.name;
            if (f.relatedEntity) {
                f.relatedEntity.fields.forEach(rField => {
                    this.fieldToColumnMapping[`${f.name}.${rField.name}`] = `${f.name}.${rField.column.name}`;
                });
            }
        });
        this.insertRecordSqlTemplate = insertRecordSqlTemplate(this.entityInfo);
        this.replaceRecordSqlTemplate = replaceRecordSqlTemplate(this.entityInfo);
        this.deleteRecordTemplate = deleteRecordTemplate(this.entityInfo);
        this.selectSqlTemplate = selectSqlTemplate(this.entityInfo);
        this.countQuery = countQueryTemplate(this.entityInfo);
    }

    public getValue(entity: any, field: FieldInfo) {
        return getValue(entity, field);
    }

    public async add(entity: any): Promise<any> {
        if (this.primaryKeyField) {
            const idValue = entity[this.primaryKeyField.name] ?? '';
            if (this.primaryKeyField.column.sqlType === 'number' && isEmpty(trim(idValue))) {
                if (this.primaryKeyField.column.generatorType === 'identity') {
                    // updating the id with the latest id obtained from nextId.
                    entity[this.primaryKeyField.name] = this.nextId();
                } else {
                    // for assigned type, get the primaryKeyValue from the relatedTableData which is inside the entity
                    const primaryKeyValue = getValue(entity, this.primaryKeyField);
                    entity[this.primaryKeyField.name] = primaryKeyValue;
                }
            }
        }
        const rowData = mapObjToRow(this, entity);
        const params = this.entityInfo.fields.map(f => rowData[f.column.name]);
        const result = await this.executeSQL(this.insertRecordSqlTemplate, params);
        return result.lastInsertRowId;
    }

    /**
     * clears all data of this store.
     */
    public async clear() {
        return this.executeSQL('DELETE FROM ' + escapeName(this.entityInfo.name));
    }

    /**
     * creates the stores if it does not exist
     */
    public async create(): Promise<any> {
        await this.executeSQL(this.createTableSql());
        return this;
    }

    /**
     * counts the number of records that satisfy the given filter criteria.
     * @param {FilterCriterion[]} filterCriteria
     * @returns {object} promise that is resolved with count
     */
    public async count(filterCriteria?: FilterCriterion[]): Promise<number> {
        const sql = this.countQuery + generateWherClause(this, filterCriteria);
        const result = await this.executeSQL(sql);
        const rows = await result.getAllAsync();
        return rows[0]['count'];
    }

    /**
     * This function deserializes the given map object to FormData, provided that map object was
     * serialized by using serialize method of this store.
     * @param  {object} map object to deserialize
     * @returns {object} promise that is resolved with the deserialized FormData.
     */
    public deserialize(map: any) {
        return this.deserializeMapToFormData(map);
    }

    /**
     * filters data of this store that statisfy the given filter criteria.
     * @param {FilterCriterion[]} filterCriteria
     * @param  {string=} sort ex: 'filedname asc/desc'
     * @param  {object=} page {'offset' : 0, "limit" : 20}
     * @returns {object} promise that is resolved with the filtered data.
     */
    public async filter(filterCriteria?: FilterCriterion[], sort?: string, page?: Pagination): Promise<any[]> {
        let sql = this.selectSqlTemplate;
        sql += generateWherClause(this, filterCriteria);
        sql += generateOrderByClause(this, sort);
        sql += geneateLimitClause(page);
        const rows = (await((await this.executeSQL(sql)).getAllAsync()));
        const objArr = [],
            rowCount = rows.length;
        for (let i = 0; i < rowCount; i++) {
            objArr.push(mapRowDataToObj(this.entityInfo, rows[i]));
        }
        return objArr;
    }

    // fetches all the data related to the primaryKey
    public refresh(data: any) {
        const primaryKey = getValue(data, this.primaryKeyField);
        return primaryKey ? this.get(primaryKey) : Promise.resolve(data);
    }

    /**
     * deletes the record with the given primary key.
     * @param  {object} primaryKey primary key of the record
     */
    public delete(primaryKey: any) {
        return this.executeSQL(this.deleteRecordTemplate, [primaryKey]);
    }

    /**
     * finds the record with the given primary key.
     * @param  {object} primaryKey primary key of the record
     * @returns {object} promise that is resolved with entity
     */
    public get(primaryKey: any) {
        const filterCriteria = [{
            attributeName: this.primaryKeyField.name,
            filterCondition: '=',
            attributeValue: primaryKey,
            attributeType: this.primaryKeyField.column.sqlType.toUpperCase() }];
        return this.filter(filterCriteria).then(function (obj) {
            return obj && obj.length === 1 ? obj[0] : undefined;
        });
    }

    /**
     * saves the given entity to the store. If the record is not available, then a new record will be created.
     * @param {object} entity the entity to save
     * @returns {object} promise
     */
    public async save(entity: any) {
        return this.saveAll([entity]);
    }

    /**
     * saves the given entity to the store. If the record is not available, then a new record will be created.
     * @param {object} entities the entity to save
     * @returns {object} promise
     */
    public async saveAll(entities: any[]) {
        entities = entities.filter(e => e != null);
        return Promise.all(entities.map(entity => {
            const rowData = mapObjToRow(this, entity);
            const params = this.entityInfo.fields.map(f => rowData[f.column.name]);
            return this.executeSQL(this.replaceRecordSqlTemplate, params);
        }));
    }

    /**
     * Based on this store columns, this function converts the given FormData to a map object.
     * Multipart file is stored as a local file. If form data cannot be serialized,
     * then formData is returned back.
     * @param  {FormData} formData object to serialize
     * @returns {object} promise that is resolved with a map.
     */
    public serialize(formData: any) {
        return this.serializeFormDataToMap(formData);
    }

    /**
     * Save blob to a local file
     * @param blob
     * @returns {*}
     */
    // private saveBlobToFile(blob: any) {
    //     const fileName = this.deviceFileService.appendToFileName(blob.name),
    //         uploadDir = this.deviceFileService.getUploadDirectory();
    //     return this.file.writeFile(uploadDir, fileName, blob).then(function () {
    //         return {
    //             'name' : blob.name,
    //             'type' : blob.type,
    //             'lastModified' : blob.lastModified,
    //             'lastModifiedDate' : blob.lastModifiedDate,
    //             'size' : blob.size,
    //             'wmLocalPath' : uploadDir + '/' + fileName
    //         };
    //     });
    // }

    /**
     * Converts form data object to map for storing request in local database..
     */
    private async serializeFormDataToMap(formData: any) {
        const blobFields = this.entityInfo.fields.filter(f => f.column.sqlType === 'blob');
        let map = {} as any;
        if (formData && typeof formData.append === 'function' && formData.rowData) {
            Object.keys(formData.rowData).forEach((fieldName: string) => {
                const fieldData = formData.rowData[fieldName];
                if (fieldData && blobFields.find(f => f.name === fieldName)) {
                    // promises.push(this.saveBlobToFile(fieldData).then(localFile => {
                    //     map[fieldName] = localFile;
                    // }));
                } else {
                    map[fieldName] = fieldData;
                }
            });
        } else {
            map = formData;
        }
        //return Promise.all(promises).then(() => map);
        return map;
    }

    /**
     * Converts map object back to form data.
     */
    private async deserializeMapToFormData(map: any) {
        const blobColumns = this.entityInfo.fields.filter(f => f.column.sqlType === 'blob');
        const formData = new FormData();
        // forEach(blobColumns, column => {
        //     const value = map[column.fieldName];
        //     if (value && value.wmLocalPath) {
        //         promises.push(convertToBlob(value.wmLocalPath)
        //             .then(result => formData.append(column.fieldName, result.blob, value.name)));
        //         map[column.fieldName] = '';
        //     }
        // });
        formData.append("WM_DATA_JSON", new Blob([JSON.stringify(map)], {
            type: 'application/json'
        }));
        //return Promise.all(promises).then(() => formData);
        return formData;
    }

    private createTableSql() {
        const fieldStr = this.entityInfo.fields.reduce((result, field) => {
            const { column } = field;
            let str = escapeName(column.name);
            if (column.primaryKey) {
                if (column.sqlType === 'number' && column.generatorType === 'databaseIdentity') {
                    str += ' INTEGER PRIMARY KEY AUTOINCREMENT';
                } else {
                    str += ' PRIMARY KEY';
                }
            }
            return result ? result + ',' + str : str;
        }, '');
        return `CREATE TABLE IF NOT EXISTS ${escapeName(this.entityInfo.table.name)} (${fieldStr})`;
    }
}
