import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPageStyles } from './page.styles';

export class WmPageState extends BaseComponentState<WmPageProps> {}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {

  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  renderWidget(props: WmPageProps) {
    return (
      <View style={this.styles.root}>
        {props.children}
      </View>
    ); 
  }
}
