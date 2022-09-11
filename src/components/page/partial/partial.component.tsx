import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPartialProps from './partial.props';
import { DEFAULT_CLASS, WmPartialStyles } from './partial.styles';

export class WmPartialState extends BaseComponentState<WmPartialProps> {

}

export default class WmPartial extends BaseComponent<WmPartialProps, WmPartialState, WmPartialStyles> {

  constructor(props: WmPartialProps) {
    super(props, DEFAULT_CLASS, );
  }

  renderWidget(props: WmPartialProps) {
    return (
      <View style={this.styles.root}>
        {props.children}
      </View>
    ); 
  }
}
