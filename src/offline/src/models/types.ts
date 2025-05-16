export class NamedQueryInfo {
    public params: NamedQueryParamInfo[] = null as any;
    public response = {
        properties: []
    };
    constructor(public name: string, public query: string) {

    }
}

export class NamedQueryParamInfo {
    constructor(public name: string, public type?: string, public variableType?: string) {

    }
}

export enum DataType {
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    LOCALDATETIME = 'LOCALDATETIME',
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING'
}

export interface PullConfig {
    size: number;
    query: string;
    orderBy: string;
    maxNoOfRecords: number;
    defaultType: string;
    pullType: PullType;
    filter: OfflineDataFilter[];
    deltaFieldName?: string;
}

export enum PullType {
    LIVE = 'LIVE',
    BUNDLED = 'BUNDLED',
    APP_START = 'APP_START'
}

export interface OfflineDataFilter {
    attributeName: string;
    attributeValue: any;
    attributeType: string;
    filterCondition: string;
}

export class PushConfig {
    insertEnabled = false;
    updateEnabled = false;
    deleteEnabled = false;
    readEnabled = true;
}


export interface Observer<T> {
    next?: (t: T) => any,
    complete?: () => any
}