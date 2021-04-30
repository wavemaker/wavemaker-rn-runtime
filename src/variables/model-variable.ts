import { BaseVariable, VariableConfig } from "./base-variable";

export class ModelVariable extends BaseVariable {

    constructor(config: VariableConfig) {
        super(config);
    }

    invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<BaseVariable>  {
        return super.invoke(params, onSuccess, onError).then(() => {
            this.dataSet = this.params;
            return this;
        });
    }
}