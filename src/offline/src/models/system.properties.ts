import moment from "moment";

export interface SystemProperty {
    name: string,
    value: (name: string, params: any) => Promise<any>
}

export const NONE = {
    name : 'NONE',
    value : () => ''
};

export const USER_NAME = {
    name : 'USER_NAME',
    value : () => 'no_user'
};

export const DATE_TIME = {
    name : 'DATE_TIME',
    value : () => moment().format('YYYY-MM-DDThh:mm:ss')
};

export const DATE = {
    name : 'DATE',
    value : () => moment().format('YYYY-MM-DD')
};

export const TIME = {
    name : 'TIME',
    value : () => moment().format('hh:mm:ss')
};