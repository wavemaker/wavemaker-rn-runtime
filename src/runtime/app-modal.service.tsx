import injector from './injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';

class AppModalService implements ModalService {
    public modalOptions = {} as ModalOptions;

    private modalsOpened = [] as ModalOptions[];

    private showLastModal() {
        this.modalOptions = this.modalsOpened.length ? this.modalsOpened[this.modalsOpened.length - 1] : {} as ModalOptions;
        setTimeout(() => {
            injector.get<AppConfig>('APP_CONFIG').refresh();
        });
    }

    public showModal(options: ModalOptions) {
        const i = this.modalsOpened.findIndex(o => o === options);
        if (i < 0) {
            this.modalsOpened.push(options);
            this.showLastModal();
        }
    }
    
    public hideModal(options: ModalOptions) {
        const i = this.modalsOpened.findIndex(o => o === options);
        if (i >= 0) {
            const o = this.modalsOpened.splice(i, 1)[0];
            o.onClose && o.onClose();
            this.showLastModal();
        }
    }
}

const appModalService = new AppModalService();

export default appModalService;