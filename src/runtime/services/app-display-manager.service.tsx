import {DisplayManager, DisplayOptions} from "@wavemaker/app-rn-runtime/core/display.manager";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import injector from "@wavemaker/app-rn-runtime/core/injector";


export class AppDisplayManagerService implements DisplayManager {
  public displayOptions = {} as DisplayOptions;

  show(options: DisplayOptions) {
    this.displayOptions = options;
    (injector.get('AppConfig') as AppConfig).refresh();
    return this.destroy;
  }

  destroy() {
    this.displayOptions = {} as DisplayOptions;
    this.displayOptions.content = null;
  }
}

const appDisplayManagerService = new AppDisplayManagerService();

export default appDisplayManagerService;
