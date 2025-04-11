import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

class AppToastService implements ToastService {

    public toastsOpened = [] as ToastOptions[];
    public appConfig: any;
    public refreshCount = 0;

    private getAppConfig() {
      if (!this.appConfig) {
        this.appConfig = injector.get<AppConfig>('APP_CONFIG');
      }
      return this.appConfig;
    }
    
    refresh() {
      this.refreshCount++;
      this.appConfig.refresh();
    }

    public showToast(options: ToastOptions) {
        const i = this.toastsOpened.findIndex(o => o.name === options.name);
        let timeout: any;
        this.refreshCount++;
        if (i < 0) {
          options.elevationIndex = this.toastsOpened.length + this.getAppConfig().app.modalsOpened + 1;
          this.toastsOpened.push(options);
            // hide the toast when toaster is clicked
            if (options.hideOnClick) {
              let cb = options.onClick;
              options.onClick = () => {
                cb && cb();
                this.hideToast(options);
                clearTimeout(timeout);
              }
            }
            if (options.duration) {
              timeout = setTimeout(() => {
                    this.hideToast(options);
                }, options.duration);
            }
            options.closeToast = () => {
              let cb = options.onClick;
              cb && cb();
              this.hideToast(options);
              clearTimeout(timeout);
            }
        }
        this.refresh();
    }

    public hideToast(options?: ToastOptions) {
        const i = options ? this.toastsOpened.findIndex(o => o.name === options.name) : (this.toastsOpened.length - 1);
        if (i >= 0) {
            const o = this.toastsOpened.splice(i, 1)[0];
            this.refresh();
            options?.onClose && options.onClose();
        }
    }
}

const appToastService = new AppToastService();

export default appToastService;
