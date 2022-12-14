import React from 'react';
import { ScrollView } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmDialogcontentProps from './dialogcontent.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmDialogcontentStyles } from './dialogcontent.styles';

export class WmDialogcontentState extends BaseComponentState<WmDialogcontentProps> {}

export default class WmDialogcontent extends BaseComponent<WmDialogcontentProps, WmDialogcontentState, WmDialogcontentStyles> {

  constructor(props: WmDialogcontentProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmDialogcontentProps());
  }

  renderWidget(props: WmDialogcontentProps) {
    return (<ScrollView contentContainerStyle={this.styles.root} style={{maxHeight: '90%'}}>{props.children}</ScrollView>);
  }
}
