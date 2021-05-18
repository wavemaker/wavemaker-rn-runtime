import React from 'react';
import { View } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

import WmGridrowProps from './gridrow.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './gridrow.styles';

export default class WmGridrow extends BaseComponent<WmGridrowProps> {

  constructor(props: WmGridrowProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmGridrowProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <View style={this.styles.root}>{props.children}</View>
    ): null; 
  }
}
