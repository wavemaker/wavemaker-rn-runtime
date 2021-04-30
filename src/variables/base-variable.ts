export interface VariableConfig {
    paramProvider: Function;
    onSuccess: Function;
    onError: Function;
}

export abstract class BaseVariable {
    params: any = {};
    dataSet: any = {};

    constructor(public config: VariableConfig) {
        
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<BaseVariable> {
        if (!params) {
            this.params = this.config.paramProvider();
        }
        return Promise.resolve(this);
    }

    public invokeOnParamChange(): Promise<BaseVariable> {
        const last = this.params;
        const latest = this.config.paramProvider();
        if (last !== latest) {
            return this.invoke(latest);
        }
        return Promise.resolve(this);
    }
}