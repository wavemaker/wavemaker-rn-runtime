import AppConfig from "../core/AppConfig";
import { ActionConfig, BaseAction } from "./base-action";

export interface NavigationActionConfig extends ActionConfig {
    appConfig: AppConfig;
}

export class NavigationAction extends BaseAction {

    constructor(config: NavigationActionConfig) {
        super(config);
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<NavigationAction> {
        const config = this.config as NavigationActionConfig;
        return super.invoke(params, onSuccess, onError).then(() => {
            config.appConfig.currentPage?.goToPage(this.params.pageName, this.params);
        }).then(() => {
            config.onSuccess && config.onSuccess(this, this.dataSet);
            return this;
        }, () => {
            config.onError && config.onError(this, null);
            return this;
        });;
    }
}