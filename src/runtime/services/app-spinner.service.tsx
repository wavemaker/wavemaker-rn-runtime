import React from 'react';

import { View } from 'react-native';

import { SpinnerService, DisplayOptions } from '@wavemaker/app-rn-runtime/core/spinner.service';
import { DisplayManager } from '@wavemaker/app-rn-runtime/core/display.manager';
import appDisplayManagerService from '@wavemaker/app-rn-runtime/runtime/services/app-display-manager.service';
import WmSpinner from '@wavemaker/app-rn-runtime/components/basic/spinner/spinner.component';

export class AppSpinnerService implements SpinnerService {
  public displayOptions = {} as DisplayOptions;
  public destroy: any;
  public delay = 0;
  private count = 0;
  private image: string = '';
  constructor(private displayManager: DisplayManager) {}

  setImage(path: string) {
    this.image = path;
  }

  show(options: DisplayOptions = {}) {
    if (this.count === 0 && !this.destroy) { 
      setTimeout(() => {
        const content = (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <WmSpinner
            caption={options.message || ''}
            classname="global-spinner" 
            image={this.image}></WmSpinner>
        </View>);
        this.destroy = this.displayManager.show({ content: content });
      }, this.delay);
    }
    this.count++;
  }

  hide() {
    if (this.count > 0) {
      this.count--;
    } else {
      this.count = 0;
    }
    if (this.count === 0) {
      setTimeout(() => {
        if (!this.count && this.destroy) {
          this.destroy.call(this.displayManager);
          this.destroy = null;
        }
      }, 300);
    }
  }
}

const spinnerService = new AppSpinnerService(appDisplayManagerService);
export default spinnerService;
