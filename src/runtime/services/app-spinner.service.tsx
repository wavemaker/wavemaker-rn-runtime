import React from 'react';

import { SpinnerService, DisplayOptions } from '@wavemaker/app-rn-runtime/core/spinner.service';
import { DisplayManager } from '@wavemaker/app-rn-runtime/core/display.manager';
import appDisplayManagerService from '@wavemaker/app-rn-runtime/runtime/services/app-display-manager.service';
import WmSpinner from '@wavemaker/app-rn-runtime/components/basic/spinner/spinner.component';

export class AppSpinnerService implements SpinnerService {
  public displayOptions = {} as DisplayOptions;
  public destroy: any;
  constructor(private displayManager: DisplayManager) {}

  show(options: DisplayOptions) {
    const content = <WmSpinner caption={options.message || ''}></WmSpinner>;
    this.destroy = this.displayManager.show({ content: content });
  }

  hide() {
    this.destroy && this.destroy.call(this.displayManager);
  }
}

const spinnerService = new AppSpinnerService(appDisplayManagerService);
export default spinnerService;
