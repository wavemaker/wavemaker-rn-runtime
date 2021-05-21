import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPartialProps from './partial.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './partial.styles';

export default class WmPartial extends BaseComponent<WmPartialProps, BaseComponentState<WmPartialProps>> {

  constructor(props: WmPartialProps) {
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
