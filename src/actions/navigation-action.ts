import AppConfig from "../core/AppConfig";
import { ActionConfig, BaseAction } from "./base-action";
import {merge} from "lodash";

export interface NavigationActionConfig extends ActionConfig {
    appConfig: AppConfig;
    operation: string;
}

export class NavigationAction extends BaseAction {
    constructor(config: NavigationActionConfig) {
        super(config);
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<NavigationAction> {
        const config = this.config as NavigationActionConfig;
        // @ts-ignore
        params = params?.data ? merge(this.config.paramProvider(), params.data) : merge(this.config.paramProvider(), this.dataSet);
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
