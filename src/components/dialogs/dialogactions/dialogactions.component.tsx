import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmDialogactionsProps from './dialogactions.props';
import { DEFAULT_CLASS, WmDialogactionsStyles } from './dialogactions.styles';

export class WmDialogactionsState extends BaseComponentState<WmDialogactionsProps> {}

export default class WmDialogactions extends BaseComponent<WmDialogactionsProps, WmDialogactionsState, WmDialogactionsStyles> {
  __TYPE='WmDialogactions';

  constructor(props: WmDialogactionsProps) {
    super(props, DEFAULT_CLASS, new WmDialogactionsProps());
  }

  renderWidget(props: WmDialogactionsProps) {
    return (
    <View 
      style={this.styles.root}
      onLayout={(event) => this.handleLayout(event)}
    >{this._background}{props.children}</View>); 
  }
}
