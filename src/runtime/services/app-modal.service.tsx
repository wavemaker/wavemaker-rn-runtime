import { BackHandler, NativeEventSubscription } from "react-native";

import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import { isAndroid, isWebPreviewMode } from "@wavemaker/app-rn-runtime/core/utils";

class AppModalService implements ModalService {
    public modalOptions = {} as ModalOptions;

    public modalsOpened = [] as ModalOptions[];
    public appConfig: any;
    private backHandlerSubscription: NativeEventSubscription | null = null;

    animatedRefs: any = [];

    private clearBackButtonPress() {
      if (this.backHandlerSubscription) {
        this.backHandlerSubscription.remove();
        this.backHandlerSubscription = null;
      }
    }

    private setBackButtonPress() {
      this.clearBackButtonPress();
      if (isAndroid() && !isWebPreviewMode() && this.modalsOpened.length > 0) {
        this.backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
      }
    }

    private handleBackButtonPress = () => {
      if (this.modalsOpened.length) {
        this.hideModal();
        return true;
      }
      return false;
    }

    private getAppConfig() {
      if (!this.appConfig) {
        this.appConfig = injector.get<AppConfig>('APP_CONFIG');
      }
      return this.appConfig;
    }

    private showLastModal() {
        this.modalOptions = this.modalsOpened.length ? this.modalsOpened[this.modalsOpened.length - 1] : {} as ModalOptions;
        this.refresh();
        this.setBackButtonPress();
    }

    public refresh() {
      this.getAppConfig().refresh();
    }

    public showModal(options: ModalOptions) {
        const i = this.modalsOpened.findIndex(o => o === options);
        if (i < 0) {
          options.elevationIndex = parseInt(this.getAppConfig().app.toastsOpened + this.modalsOpened.length + 1);
          this.modalsOpened.push(options);
            this.showLastModal();
             // widgets in dialog are not accessible. Hence adding setTimeout
        setTimeout(() => {
          this.modalOptions.onOpen && this.modalOptions.onOpen();
        },500);
        }
    }

    public hideModal(options?: ModalOptions) {
        const i = options ? this.modalsOpened.findIndex(o => o === options) : (this.modalsOpened.length - 1);
        if (i >= 0) {
          Promise.resolve()
            .then(() => this.modalsOpened.length > 1 && this.animatedRefs && this.animatedRefs[i].triggerExit())
            .then(() => {
              const o = this.modalsOpened[i];
              return o && o.onClose && o.onClose();
            })
            .then(() => this.modalsOpened.splice(i, 1))
            .then(() => this.showLastModal());
        }
        this.clearBackButtonPress();
    }
}

const appModalService = new AppModalService();

export default appModalService;
