import React from 'react';
import { View } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

import WmGridcolumnProps from './gridcolumn.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './gridcolumn.styles';

export default class WmGridcolumn extends BaseComponent<WmGridcolumnProps> {

  constructor(props: WmGridcolumnProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmGridcolumnProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <View style={this.styles.container}>{props.children}</View>
    ): null; 
  }
}
