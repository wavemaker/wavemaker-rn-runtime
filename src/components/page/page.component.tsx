import React from 'react';
import { PanResponder, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, WmPageStyles } from './page.styles';

export class WmPageState extends BaseComponentState<WmPageProps> {}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {

  panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (e) => {
      this.notify('globaltouch', [e]);
      return false;
    },
  });
  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS, );
  }

  renderWidget(props: WmPageProps) {
    return (
      <View style={this.styles.root} {...this.panResponder.panHandlers}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
