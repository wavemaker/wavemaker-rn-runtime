import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmDialogactionsProps from './dialogactions.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmDialogactionsStyles } from './dialogactions.styles';

export class WmDialogactionsState extends BaseComponentState<WmDialogactionsProps> {}

export default class WmDialogactions extends BaseComponent<WmDialogactionsProps, WmDialogactionsState, WmDialogactionsStyles> {
  __TYPE='WmDialogactions';

  constructor(props: WmDialogactionsProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmDialogactionsProps());
  }

  renderWidget(props: WmDialogactionsProps) {
    return (<View style={this.styles.root}>{props.children}</View>); 
  }
}