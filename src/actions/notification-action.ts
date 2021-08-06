import { ActionConfig, BaseAction } from "./base-action";
import { ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';
import React from 'react';
export interface NotificationActionConfig extends ActionConfig {
    showDialog: Function;
    onOk: any;
    onCancel: any;
    onClose: any;
    operation: string;
    partialContent: React.ReactNode;
    toasterService: () => ToastService;
}
export class NotificationAction extends BaseAction<NotificationActionConfig> {
    showDialog: Function;
    constructor(config: NotificationActionConfig) {
        super(config);
        this.showDialog = config.showDialog;
    }

    prepareToastOptions(content?: any) {
        const params = this.config.paramProvider();
        const o = {} as ToastOptions;
        o.text = params.text;
        o.type = params.class?.toLowerCase();
        o.onClose = this.config.onClose;
        o.onClick = this.config.onOk;
        o.content = this.config.partialContent;
        const placement = params.toasterPosition.split(' ')[0];
        switch(placement) {
            case 'top':
                o.styles = {top: 0};
                break;
            case 'bottom':
                o.styles = {bottom: 0};
                break;
            case 'center':
                o.styles = {top: '50%'};
                break;
        }
        if (this.config.partialContent) {
            o.styles.backgroundColor = 'black';
        }
        o.duration = parseInt(params.duration);
        o.name = this.name;
        return o;
      }

    invoke(options: any, success: any, error: any) {
        super.invoke(options, success, error);
        if (this.config.operation === 'toast') {
            const toasterService = this.config.toasterService();
            return toasterService.showToast(this.prepareToastOptions());
        } else {
            return this.showDialog && this.showDialog({...this.params, onOk: this.config.onOk, onCancel: this.config.onCancel, onClose: this.config.onClose});
        }
    }
}