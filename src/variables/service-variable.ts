import axios from "axios";
import { BaseVariable, VariableConfig } from "./base-variable";

export interface ServiceVariableConfig extends VariableConfig {
    serviceInfo: any;
}

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
        return axios.get(config.serviceInfo.directPath + '?'+ queryParams).then(result => {
            this.dataSet = result.data;
        }).then(() => {
            config.onSuccess && config.onSuccess(this, this.dataSet);
            return this;
        }, () => {
            config.onError && config.onError(this, null);
            return this;
        });
    }
}