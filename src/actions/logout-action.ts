import { ActionConfig, BaseAction } from "./base-action";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import { SecurityService } from "@wavemaker/app-rn-runtime/core/security.service";
export interface LogoutActionConfig extends ActionConfig {
    onSuccess: any;
    appConfig: AppConfig;
    securityService: () => SecurityService;
}
export class LogoutAction extends BaseAction<LogoutActionConfig> {
    constructor(config: LogoutActionConfig) {
        super(config);
    }

    invoke(options: any, success: any, error: any) {
        return this.config.securityService().appLogout({baseURL: this.config.appConfig.url});
    }
}