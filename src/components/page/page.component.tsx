import React from 'react';
import { View } from 'react-native';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './page.styles';

export default class WmPage extends BaseComponent<WmPageProps> {

  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <View style={this.styles.root}>
        {props.children}
      </View>
    ); 
  }
}
