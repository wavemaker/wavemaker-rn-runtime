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
  public skeleton: boolean = false;
  constructor(private displayManager: DisplayManager) {}

  setImage(path: string) {
    this.image = path;
  }

  show(options: DisplayOptions = {}) {
    this.skeleton = options.loader.loader == 'skeleton';
    if (this.count === 0 && !this.destroy) { 
      setTimeout(() => {
        const content = (<>
          {!this.skeleton? 
            <View style={{ justifyContent: 'center', alignItems: 'center', width:'100%', height:'100%', backgroundColor:'#ffffff', opacity: 0.8 }}>
              <WmSpinner
                caption={options.message || ''}
                classname="global-spinner"
                lottie={options.loader}></WmSpinner>
            </View> : null}
            </>);
        this.destroy = this.displayManager.show({ content: content });
      }, this.delay);
    }
    this.count++;
  }

  hide() {
    this.skeleton = false;
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
