import { ActionConfig, BaseAction } from "./base-action";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
export interface LoginActionConfig extends ActionConfig {
    appConfig: AppConfig;
}
export class LoginAction extends BaseAction<LoginActionConfig> {
    constructor(config: LoginActionConfig) {
        super(config);
    }

    invoke(options: any, success: any, error: any) {
        return options.securityService.appLogin({baseURL: this.config.appConfig.url, formData: options.formData})
        .then((data: any) => {
            this.config.onSuccess && this.config.onSuccess(this, data);
            return Promise.resolve(data);
        })
        .catch((error: any) => {
            this.config.onError && this.config.onError(this, error);
            return Promise.reject(error);
        });
    }
}