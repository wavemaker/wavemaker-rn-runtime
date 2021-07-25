import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWizardstepProps from './wizardstep.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmWizardstepStyles } from './wizardstep.styles';

export class WmWizardstepState extends BaseComponentState<WmWizardstepProps> {}

export default class WmWizardstep extends BaseComponent<WmWizardstepProps, WmWizardstepState, WmWizardstepStyles> {

  constructor(props: WmWizardstepProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmWizardstepProps());
  }

  invokeNextCB(index: number) {
    this.invokeEventCallback('onNext', [this.proxy, this, index]);
  }

  invokePrevCB(index: number) {
    this.invokeEventCallback('onPrev', [this.proxy, this, index]);
  }

  invokeSkipCB(index: number) {
    this.invokeEventCallback('onSkip', [this.proxy, this, index]);
  }

  renderWidget(props: WmWizardstepProps) {
    return (<View style={this.styles.root}>{props.children}</View>);
  }
}
