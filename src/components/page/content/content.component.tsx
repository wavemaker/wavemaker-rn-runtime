import React from 'react';
import { View } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

import WmContentProps from './content.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './content.styles';

export default class WmContent extends BaseComponent<WmContentProps> {

  constructor(props: WmContentProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <View style={this.styles.container}>
        {props.children}
      </View>
    ); 
  }
}
