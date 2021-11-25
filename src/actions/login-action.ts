import { ActionConfig, BaseAction } from "./base-action";
import { SecurityService } from "@wavemaker/app-rn-runtime/core/security.service";
import { get } from 'lodash';
export interface LoginActionConfig extends ActionConfig {
    securityService: () => SecurityService;
    baseURL: String;
}
export class LoginAction extends BaseAction<LoginActionConfig> {
    constructor(config: LoginActionConfig) {
        super(config);
    }

    invoke(options: any, successcb?: Function, errorcb?: Function) {
        return this.config.securityService().appLogin({baseURL: this.config.baseURL, formData: get(options, 'formData')})
        .then((data: any) => {
            this.config.onSuccess && this.config.onSuccess(this, data);
            successcb && successcb(data);
        })
        .catch((error: any) => {
            this.config.onError && this.config.onError(this, error);
            errorcb && errorcb(error);
        });
    }
}
