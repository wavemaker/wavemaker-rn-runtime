import axios from "axios";
import { BaseVariable, VariableConfig, VariableEvents } from "./base-variable";

export interface ServiceVariableConfig extends VariableConfig {
    serviceInfo: any;
}

enum _ServiceVariableEvents {
    BEFORE_INVOKE = 'beforeInvoke'
}

export type ServiceVariableEvents = _ServiceVariableEvents | VariableEvents

export class ServiceVariable extends BaseVariable {

    constructor(config: ServiceVariableConfig) {
        super(config);
    }

    invoke() {
        super.invoke();
        const config = (this.config as ServiceVariableConfig);
        const queryParams = config.serviceInfo.parameters
            .filter((p:any) => p.parameterType === 'query')
            .map((p: any) => {
                return `${p.name}=${this.params[p.name]}`
            }).join('&');
        this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);
        return axios.get(config.serviceInfo.directPath + '?'+ queryParams).then(result => {
            this.dataSet = result.data;
        }).then(() => {
            config.onSuccess && config.onSuccess(this, this.dataSet);
            this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
        }, () => {
            config.onError && config.onError(this, null);
            this.notify(VariableEvents.ERROR, [this, this.dataSet]);
        }).then(() => {
            this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
            return this;
        });
    }
}