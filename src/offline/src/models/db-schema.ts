import { ColumnSpec, DBSpec, TableSpec } from "./db.spec";

export class DBSchema {
    public readonly name: string;
    public readonly version: number;
    public readonly isInternal: boolean;
    public readonly tables = {} as {[name: string] : TableSchema};
    
    constructor(spec: DBSpec) {
        this.name = spec.name;
        this.version = spec.version ?? 1;
        this.isInternal = spec.isInternal ?? false;
        spec.tables?.forEach(t => {
            this.tables[t.name] = new TableSchema(this, t);
        });
        spec.tables?.forEach(t => {
            const tableSchema = this.tables[t.name];
            t.relations?.forEach(r => {
                const sourceColumn = tableSchema?.columns[r.sourceColumn];
                const targetColumn = this.tables[r.targetTable]?.columns[r.targetColumn];
                if (sourceColumn && targetColumn) {
                    tableSchema?.relations.push(new RelationSchema(r.name, sourceColumn, targetColumn, r.type));
                }
            });
        });
    }
}

export class TableSchema {
    public readonly name: string;
    public readonly entityName: string;
    public readonly columns = {} as {[name: string] : ColumnSchema};
    public readonly relations: RelationSchema[] = [];

    constructor(public readonly db: DBSchema, spec: TableSpec) {
        this.name = spec.name;
        this.entityName = spec.entityName || spec.name;
        spec.columns?.forEach(c => {
            this.columns[c.name] = new ColumnSchema(this, c);
        });
    }
};

export class RelationSchema {
    constructor(
        public readonly name: string,
        public readonly source: ColumnSchema, 
        public readonly target: ColumnSchema,
        public readonly type: 'OneToOne' | 'ManyToOne' = 'OneToOne') {}
};

export class ColumnSchema {
    public readonly name: string;
    public readonly fieldName: string;
    public readonly sqlType: 'number' | 'string' | 'boolean' | 'date' | 'time' | 'datetime' | 'blob';
    public readonly primaryKey: boolean;
    public readonly defaultValue?: any;
    public readonly generatorType?: 'databaseIdentity' | 'identity';

    constructor(public readonly table: TableSchema, spec: ColumnSpec) {
        this.name = spec.name;
        this.fieldName = spec.fieldName ?? spec.name;
        this.sqlType = spec.sqlType ?? 'string';
        this.primaryKey = spec.primaryKey ?? false;
        this.defaultValue = spec.defaultValue;
        this.generatorType = spec.autoGenerate ? 'databaseIdentity' : undefined;
    }
};
