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
const DEFAULT_DURATION = 3000;
export class NotificationAction extends BaseAction<NotificationActionConfig> {
    showDialog: Function;
    constructor(config: NotificationActionConfig) {
        super(config);
        this.showDialog = config.showDialog;
    }

    prepareToastOptions(options: any = {}) {
        const params = this.config.paramProvider();
        const o = {} as ToastOptions;
        o.text = options.message || params.text;
        o.type = options.class?.toLowerCase() || params.class?.toLowerCase();
        o.onClose = () => {
            this.config.onClose && this.config.onClose(this);
        },
        o.onClick = () => {
            this.config.onOk && this.config.onOk(this);
        },
        o.content = this.config.partialContent;
        o.hideOnClick = options.hideOnClick || true;
        const toasterPosition = options.position || params.toasterPosition || 'bottom right';
        const placement = toasterPosition.split(' ')[0];
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
            if (!o.styles) {
                o.styles = {};
            }
        }
        if (!params.duration) {
          params.duration = (params.duration !== 0 && o.type === 'success') ? DEFAULT_DURATION : 0;
        }
        o.duration = parseInt(options.duration || params.duration);
        o.name = this.name;
        o.classname = options.classname || params.classname;
        return o;
      }

    getMessage() {
        return this.config.paramProvider().text;
    }

    invoke(options: any, success: any, error: any) {
        super.invoke(options, success, error);
        if (this.config.operation === 'toast') {
            const toasterService = this.config.toasterService();
            return toasterService.showToast(this.prepareToastOptions(options));
        } else {
            return this.showDialog && this.showDialog({...this.params, onOk: this.config.onOk, onCancel: this.config.onCancel, onClose: this.config.onClose});
        }
    }
}
