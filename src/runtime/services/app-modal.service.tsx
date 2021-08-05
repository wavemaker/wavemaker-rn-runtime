import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';

class AppModalService implements ModalService {
    public modalOptions = {} as ModalOptions;

    public modalsOpened = [] as ModalOptions[];

    private showLastModal() {
        this.modalOptions = this.modalsOpened.length ? this.modalsOpened[this.modalsOpened.length - 1] : {} as ModalOptions;
        injector.get<AppConfig>('APP_CONFIG').refresh();
    }

    public showModal(options: ModalOptions) {
        const i = this.modalsOpened.findIndex(o => o === options);
        if (i < 0) {
            this.modalsOpened.push(options);
            this.showLastModal();
        }
        injector.get<AppConfig>('APP_CONFIG').refresh();
    }

    public hideModal(options?: ModalOptions) {
        const i = options ? this.modalsOpened.findIndex(o => o === options) : (this.modalsOpened.length - 1);
        if (i >= 0) {
            const o = this.modalsOpened.splice(i, 1)[0];
            const p: any = o.onClose && o.onClose();
            if (p && p instanceof Promise) {
                p.then(() => this.showLastModal());
            } else {
                this.showLastModal();
            }
        }
    }
}

const appModalService = new AppModalService();

export default appModalService;
