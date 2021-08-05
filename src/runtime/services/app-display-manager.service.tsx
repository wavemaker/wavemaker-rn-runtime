import {DisplayManager, DisplayOptions} from "@wavemaker/app-rn-runtime/core/display.manager";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import injector from "@wavemaker/app-rn-runtime/core/injector";


export class AppDisplayManagerService implements DisplayManager {
  public displayOptions = {} as DisplayOptions;

  show(options: DisplayOptions) {
    this.displayOptions = options;
    this.refresh();
    return this.destroy;
  }

  refresh() {
    (injector.get('AppConfig') as AppConfig).refresh();
  }

  destroy() {
    this.displayOptions.content = null;
    this.displayOptions = {} as DisplayOptions;
    this.refresh();
  }
}

const appDisplayManagerService = new AppDisplayManagerService();

export default appDisplayManagerService;
