import AppConfig from "../core/AppConfig";
import { ActionConfig, BaseAction } from "./base-action";

export interface NavigationActionConfig extends ActionConfig {
    appConfig: AppConfig;
    operation: string;
}

export class NavigationAction extends BaseAction {
    category: string = 'wm.NavigationVariable';
    constructor(config: NavigationActionConfig) {
        super(config);
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<NavigationAction> {
        const config = this.config as NavigationActionConfig;
      return super.invoke(params, onSuccess, onError).then(() => {
            config.operation === 'goToPreviousPage' ? config.appConfig.currentPage?.goBack() : config.appConfig.currentPage?.goToPage(this.params.pageName, this.params);
        }).then(() => {
            config.onSuccess && config.onSuccess(this, this.dataSet);
            return this;
        }, () => {
            config.onError && config.onError(this, null);
            return this;
        });;
    }
}
