import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWizardstepProps from './wizardstep.props';
import { DEFAULT_CLASS, WmWizardstepStyles } from './wizardstep.styles';
import WmWizard from '../wizard.component';
import { isBoolean } from 'lodash-es';

export class WmWizardstepState extends BaseComponentState<WmWizardstepProps> {
  active = false;
  showContent: boolean = false;
}

export default class WmWizardstep extends BaseComponent<WmWizardstepProps, WmWizardstepState, WmWizardstepStyles> {

  constructor(props: WmWizardstepProps) {
    super(props, DEFAULT_CLASS, new WmWizardstepProps(), new WmWizardstepState());
  }

 
  componentDidMount() {
    const wizard = (this.parent) as WmWizard;
    wizard.addWizardStep(this);
    super.componentDidMount();
  }

  setActive() {
    this.updateState({
      active: true
    } as WmWizardstepState);
  }

  setInActive() {
    this.updateState({
      active: false
    } as WmWizardstepState);
  }

  isVisible() {
    return super.isVisible() && this.state.active;
  }

  invokeNextCB(index: number) : boolean {
    return this.invokeEventCallback('onNext', [this.proxy, this, index]);
  }

  invokePrevCB(index: number) : boolean {
    return this.invokeEventCallback('onPrev', [this.proxy, this, index]);
  }

  invokeSkipCB(index: number) {
    this.invokeEventCallback('onSkip', [this.proxy, this, index]);
  }
  onPropertyChange(name: string, $new: any, $old: any): void {
    switch(name){
      case 'disableprev':
      case 'disablenext':
      case 'disabledone':
      case 'enableskip':
      case 'showprev':
      case 'shownext':
      case 'showdone':
        setTimeout(() => {
          this.parent.forceUpdate();
        }, 10);
    }
  }
  renderWidget(props: WmWizardstepProps) {
    if(!this.state.showContent && this.isVisible()){
      this.updateState({showContent: true} as WmWizardstepState, ()=>{
        this.invokeEventCallback('onLoad', [this]);
      });
    }
    return this.state.showContent && (<View style={this.styles.root}>{this._background}{props.children}</View>);
  }
}
