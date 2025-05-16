export type DBSpec = {
    name: string;
    version?: number;
    isInternal?: boolean;
    tables?: TableSpec[];
};

export type TableSpec = {
    name: string;
    entityName?: string;
    columns?: ColumnSpec[];
    relations?: RelationSpec[];
};

export type RelationSpec = {
    name: string;
    sourceColumn: string;
    targetTable: string;
    targetColumn: string;
    type?: 'OneToOne' | 'ManyToOne'
};

export type ColumnSpec = {
    name: string;
    fieldName?: string;
    sqlType?: 'number' | 'string' | 'boolean';
    primaryKey?: boolean;
    autoGenerate?: boolean;
    defaultValue?: any;
}