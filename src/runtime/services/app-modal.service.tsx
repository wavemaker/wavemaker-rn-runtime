import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';

class AppModalService implements ModalService {
    public modalOptions = {} as ModalOptions;

    public modalsOpened = [] as ModalOptions[];

    animatedRef: any;

    private showLastModal() {
        this.modalOptions = this.modalsOpened.length ? this.modalsOpened[this.modalsOpened.length - 1] : {} as ModalOptions;
        this.refresh();
        setTimeout(() => {
          this.modalOptions.onOpen && this.modalOptions.onOpen();
        });
    }

    public refresh() {
      injector.get<AppConfig>('APP_CONFIG').refresh();
    }

    public showModal(options: ModalOptions) {
        const i = this.modalsOpened.findIndex(o => o === options);
        if (i < 0) {
            this.modalsOpened.push(options);
            this.showLastModal();
        }
    }

    public hideModal(options?: ModalOptions) {
        const i = options ? this.modalsOpened.findIndex(o => o === options) : (this.modalsOpened.length - 1);
        if (i >= 0) {
          Promise.resolve()
            .then(() => this.modalsOpened.length > 1 && this.animatedRef && this.animatedRef.triggerExit())
            .then(() => {
              const o = this.modalsOpened[i];
              return o && o.onClose && o.onClose();
            })
            .then(() => this.modalsOpened.splice(i, 1))
            .then(() => this.showLastModal());
        }
    }
}

const appModalService = new AppModalService();

export default appModalService;
