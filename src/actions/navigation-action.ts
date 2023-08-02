import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import { VariableEvents } from "@wavemaker/app-rn-runtime/variables/base-variable";
import { ActionConfig, BaseAction } from "./base-action";
import {merge} from "lodash";

export interface NavigationActionConfig extends ActionConfig {
    appConfig: AppConfig;
    operation: string;
    _context: any;
}

export class NavigationAction extends BaseAction<NavigationActionConfig> {
    constructor(config: NavigationActionConfig) {
        super(config);
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<NavigationAction> {
        const config = this.config;
        // @ts-ignore
        params = params?.data ? merge(this.config.paramProvider(), params.data) : merge(this.config.paramProvider(), this.dataSet);
        this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);
        return super.invoke(params, onSuccess, onError).then(() => {
            switch(config.operation) {
                case 'goToPreviousPage':
                    config.appConfig.currentPage?.goBack();
                    break;
                case 'gotoTab':
                    this.config._context?.Widgets[(params as any)?.tabName].select();
                    break;
                case 'gotoAccordion':
                    this.config._context?.Widgets[(params as any)?.accordionName].expand();
                    break;
                case 'gotoPage' : 
                    config.appConfig.currentPage?.goToPage(this.params.pageName, this.params);
            }
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

    public navigate(params?: {}, onSuccess?: Function, onError?: Function): Promise<NavigationAction> {
        return this.invoke(params, onSuccess, onError);
    }
}
