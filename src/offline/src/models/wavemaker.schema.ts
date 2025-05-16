import { DBSchema } from "../models/db-schema";

export const WAVEMAKER_DATABASE_SCHEMA = new DBSchema({
    name: 'wavemaker',
    version: 1,
    isInternal: true,
    tables: [
        {
            name: 'key_value',
            entityName: 'key-value',
            columns: [{
                name: 'id',
                autoGenerate : true,
                sqlType : 'number',
            }, {
                name: 'key'
            }, {
                name: 'value',
            }]
        },
        {
            name: 'offlineChangeLog',
            entityName: 'offlineChangeLog',
            columns: [{
                name: 'id',
                autoGenerate : true,
                sqlType: 'number',
                primaryKey: true
            }, {
                name: 'service',
            }, {
                name: 'operation',
            }, {
                name: 'params',
            }, {
                name: 'timestamp',
            }, {
                name: 'hasError',
            }, {
                name: 'errorMessage',
            }]
        }
    ]
});