import { ActionConfig, BaseAction } from "./base-action";
import { SecurityService } from "@wavemaker/app-rn-runtime/core/security.service";
export interface LogoutActionConfig extends ActionConfig {
    securityService: () => SecurityService;
    baseURL: String;
}
export class LogoutAction extends BaseAction<LogoutActionConfig> {
    constructor(config: LogoutActionConfig) {
        super(config);
    }

    invoke(options: any, successcb?: Function, errorcb?: Function) {
        return this.config.securityService().appLogout({baseURL: this.config.baseURL})
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