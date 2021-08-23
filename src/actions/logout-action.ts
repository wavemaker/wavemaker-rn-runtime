import { ActionConfig, BaseAction } from "./base-action";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import { SecurityService } from "@wavemaker/app-rn-runtime/core/security.service";
export interface LogoutActionConfig extends ActionConfig {
    appConfig: AppConfig;
    securityService: () => SecurityService;
}
export class LogoutAction extends BaseAction<LogoutActionConfig> {
    constructor(config: LogoutActionConfig) {
        super(config);
    }

    invoke(options: any, success: any, error: any) {
        return this.config.securityService().appLogout({baseURL: this.config.appConfig.url})
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