import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

class AppToastService implements ToastService {

    public toastsOpened = [] as ToastOptions[];

    public showToast(options: ToastOptions) {
        const i = this.toastsOpened.findIndex(o => o.name === options.name);
        if (i < 0) {
            this.toastsOpened.push(options);
            injector.get<AppConfig>('APP_CONFIG').refresh();
            // hide the toast when toaster is clicked
            if (options.hideOnClick) {
              let cb = options.onClick;
              options.onClick = () => {
                this.hideToast(options);
                cb && cb();
              }
            }
            if (options.duration) {
                setTimeout(() => {
                    this.hideToast(options);
                    options.onClose && options.onClose();
                }, options.duration);
            }
        }
    }

    public hideToast(options?: ToastOptions) {
        const i = options ? this.toastsOpened.findIndex(o => o.name === options.name) : (this.toastsOpened.length - 1);
        if (i >= 0) {
            const o = this.toastsOpened.splice(i, 1)[0];
            injector.get<AppConfig>('APP_CONFIG').refresh();
        }
    }
}

const appToastService = new AppToastService();

export default appToastService;
