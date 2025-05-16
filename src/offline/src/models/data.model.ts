import * as SQLite from 'expo-sqlite';

import { LocalDBStore } from './local-db-store';
import { ColumnSchema, TableSchema } from './db-schema';
import { NamedQueryInfo, PullConfig, PushConfig } from './types';

export class DataModel {
    public schema = {
        name: '',
        isInternal: false,
        entities:  {} as {
            [name: string] : EntityInfo
        }
    };
    public stores = {} as {[name: string] : LocalDBStore};
    public queries = {} as {[name: string] : NamedQueryInfo};
    public sqliteObject: SQLite.SQLiteDatabase = null as any;
}

export class EntityInfo {
    public pullConfig: PullConfig = null as any;
    public pushConfig: PushConfig = null as any;
    private _fields: {
        [name: string] : FieldInfo
    } = {};

    constructor(public table: TableSchema) {
        Object.values(table.columns).forEach(c => {
            this._fields[c.name] = new FieldInfo(this, c);
        });
    }

    public addRelation(field: FieldInfo, relatedTo: EntityInfo) {
        this._fields[field.name] = new FieldInfo(this, field.column, relatedTo);
    }

    get entityName() {
        return this.table.entityName;
    }

    get name() {
        return this.table.name;
    }

    get fields() {
        return Object.values(this._fields);
    }

    public field(name: string) {
        return this._fields[name];
    }

    get primaryKey() {
        return this.fields.find(f => f.column.primaryKey);
    }
}

export class FieldInfo {
    constructor(public entity: EntityInfo, public column: ColumnSchema, public relatedEntity?: EntityInfo) {}

    public get name() {
        return this.column.fieldName;
    }
}
