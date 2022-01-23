import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

class AppToastService implements ToastService {

    public toastsOpened = [] as ToastOptions[];
    public appConfig: any;

    private getAppConfig() {
      if (!this.appConfig) {
        this.appConfig = injector.get<AppConfig>('APP_CONFIG');
      }
      return this.appConfig;
    }

    public showToast(options: ToastOptions) {
        const i = this.toastsOpened.findIndex(o => o.name === options.name);
        let timeout: any;
        if (i < 0) {
          options.elevationIndex = this.toastsOpened + this.getAppConfig().app.modalsOpened + 1;
          this.toastsOpened.push(options);
            this.getAppConfig().refresh();
            // hide the toast when toaster is clicked
            if (options.hideOnClick) {
              let cb = options.onClick;
              options.onClick = () => {
                this.hideToast(options);
                cb && cb();
                clearTimeout(timeout);
              }
            }
            if (options.duration) {
              timeout = setTimeout(() => {
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
