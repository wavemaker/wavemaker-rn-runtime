import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmFormFooterProps from './form-footer.props';
import { DEFAULT_CLASS, WmFormFooterStyles } from './form-footer.styles';

export class WmFormFooterState extends BaseComponentState<WmFormFooterProps> {}

export default class WmFormFooter extends BaseComponent<WmFormFooterProps, WmFormFooterState, WmFormFooterStyles> {

  constructor(props: WmFormFooterProps) {
    super(props, DEFAULT_CLASS, new WmFormFooterProps());
  }

  renderWidget(props: WmFormFooterProps) {
    return (
      <View 
        style={this.styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
