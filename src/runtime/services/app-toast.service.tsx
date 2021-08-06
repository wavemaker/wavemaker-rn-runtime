import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

class AppToastService implements ToastService {

    public modalsOpened = [] as ToastOptions[];

    public showToast(options: ToastOptions) {
        const i = this.modalsOpened.findIndex(o => o.name === options.name);
        if (i < 0) {
            this.modalsOpened.push(options);
            injector.get<AppConfig>('APP_CONFIG').refresh();
            if (options.duration) {
                setTimeout(() => {
                    this.hideToast(options);
                    options.onClose && options.onClose();
                }, options.duration);
            }
        }
        
    }

    
    
    public hideToast(options?: ToastOptions) {
        const i = options ? this.modalsOpened.findIndex(o => o.name === options.name) : (this.modalsOpened.length - 1);
        if (i >= 0) {
            const o = this.modalsOpened.splice(i, 1)[0];
            injector.get<AppConfig>('APP_CONFIG').refresh();
        }
    }
}

const appToastService = new AppToastService();

export default appToastService;