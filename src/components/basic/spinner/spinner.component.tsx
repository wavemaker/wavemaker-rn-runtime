import React from 'react';
import { ActivityIndicator } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

import WmSpinnerProps from './spinner.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './spinner.styles';

export default class WmSpinner extends BaseComponent<WmSpinnerProps> {

  constructor(props: WmSpinnerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSpinnerProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <ActivityIndicator style={this.styles.spinner}>
      </ActivityIndicator>
    ): null; 
  }
}
