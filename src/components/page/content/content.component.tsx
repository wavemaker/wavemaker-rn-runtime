import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmContentProps from './content.props';
import { DEFAULT_CLASS, WmContentStyles } from './content.styles';

export class WmContentState extends BaseComponentState<WmContentProps> {

}

export default class WmContent extends BaseComponent<WmContentProps, WmContentState, WmContentStyles> {

  constructor(props: WmContentProps) {
    super(props, DEFAULT_CLASS, );
  }

  renderWidget(props: WmContentProps) {
    return (
      <View style={this.styles.root}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
