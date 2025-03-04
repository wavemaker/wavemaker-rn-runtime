import React from 'react';
import { PanResponder, ScrollView, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, WmPageStyles } from './page.styles';
import { StickyViewContainer } from '@wavemaker/app-rn-runtime/core/sticky-container.component';

export class WmPageState extends BaseComponentState<WmPageProps> {}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {
  previousScrollPosition: number = 0;
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

        <View style={this.styles.root}> 
          {this._background}
          {props.children}
        </View>
    ); 
  }
}
