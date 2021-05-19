import React from 'react';
import { View } from 'react-native';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLayoutgridProps from './layoutgrid.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './layoutgrid.styles';

export default class WmLayoutgrid extends BaseComponent<WmLayoutgridProps> {

  constructor(props: WmLayoutgridProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLayoutgridProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <View style={this.styles.root}>{props.children}</View>
    ): null; 
  }
}
