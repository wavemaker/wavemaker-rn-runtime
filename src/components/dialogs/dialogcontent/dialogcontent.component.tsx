import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmDialogcontentProps from './dialogcontent.props';
import { DEFAULT_CLASS, WmDialogcontentStyles } from './dialogcontent.styles';

export class WmDialogcontentState extends BaseComponentState<WmDialogcontentProps> {}

export default class WmDialogcontent extends BaseComponent<WmDialogcontentProps, WmDialogcontentState, WmDialogcontentStyles> {

  constructor(props: WmDialogcontentProps) {
    super(props, DEFAULT_CLASS, new WmDialogcontentProps());
  }

  renderWidget(props: WmDialogcontentProps) {
    return (<ScrollView
      onLayout={(event) => this.handleLayout(event)}
      contentContainerStyle={[this.styles.root, {maxHeight: undefined}]}
      onScroll={(event) => {this.notify('scroll', [event])}}
      scrollEventThrottle={48}
      style={{maxHeight: this.styles.root.maxHeight}}>
        {this._background}
        {props.children}
    </ScrollView>);
  }
}
