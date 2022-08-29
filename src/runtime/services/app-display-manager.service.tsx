import { BackHandler } from "react-native";

import {DisplayManager, DisplayOptions} from "@wavemaker/app-rn-runtime/core/display.manager";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import injector from "@wavemaker/app-rn-runtime/core/injector";

export class AppDisplayManagerService implements DisplayManager {
  public displayOptions = {} as DisplayOptions;

  private clearBackButtonPress() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPress);
  }

  private setBackButtonPress() {
    this.clearBackButtonPress();
    if (this.displayOptions.content) {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
    }
  }

  private handleBackButtonPress = () => {
    if (this.displayOptions.content) {
      this.destroy();
      return true;
    }
    return false;
  }

  show(options: DisplayOptions) {
    this.displayOptions = options;
    this.refresh();
    this.setBackButtonPress();
    return this.destroy;
  }

  displayContent(content: React.ReactNode) {
    this.displayOptions.content = content;
  }

  refresh() {
    (injector.get('AppConfig') as AppConfig).refresh();
  }

  destroy() {
    this.clearBackButtonPress();
    this.displayOptions.onDestroy && this.displayOptions.onDestroy();
    this.displayOptions = {} as DisplayOptions;
    this.refresh();
  }
}

const appDisplayManagerService = new AppDisplayManagerService();

export default appDisplayManagerService;
