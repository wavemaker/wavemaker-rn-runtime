import { ActionConfig, BaseAction } from "./base-action";
import { ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';
export interface NotificationActionConfig extends ActionConfig {
    showDialog: Function;
    onOk: any;
    onCancel: any;
    onClose: any;
    operation: string;
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
        o.type = params.class.toLowerCase();
        o.onClose = this.config.onClose;
        o.onClick = this.config.onOk;
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

        o.duration = parseInt(params.duration);
        o.name = this.name;
        return o;
      }

    invoke(options: any, success: any, error: any) {
        super.invoke();
        const params = this.config.paramProvider();
        if (this.config.operation === 'toast') {
            const toasterService = this.config.toasterService();
            return toasterService.showToast(this.prepareToastOptions());
        } else {
            return this.showDialog && this.showDialog({...this.config.paramProvider(), onOk: this.config.onOk, onCancel: this.config.onCancel, onClose: this.config.onClose});
        }
    }
}