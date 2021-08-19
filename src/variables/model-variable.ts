import { BaseVariable, VariableConfig, VariableEvents } from "./base-variable";

export class ModelVariable extends BaseVariable<VariableConfig> {

    constructor(config: VariableConfig) {
        super(config);
        this.invoke();
    }

    invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<ModelVariable>  {
        this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);
        return super.invoke(params, onSuccess, onError).then(() => {
            this.dataSet = this.params;
            this.config.onSuccess && this.config.onSuccess(this, this.dataSet);
            onSuccess && onSuccess(this, this.dataSet);
            this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
        }, () => {
            this.notify(VariableEvents.ERROR, [this, this.dataSet]);
        }).then(() => {
            this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
            return this;
        });
    }
}
