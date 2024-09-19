import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmGridrowProps from './gridrow.props';
import { DEFAULT_CLASS, WmGridRowStyles } from './gridrow.styles';

export class WmGridrowState extends BaseComponentState<WmGridrowProps> {

}

export default class WmGridrow extends BaseComponent<WmGridrowProps, WmGridrowState, WmGridRowStyles> {

  constructor(props: WmGridrowProps) {
    super(props, DEFAULT_CLASS, new WmGridrowProps());
  }

  renderWidget(props: WmGridrowProps) {
    return (
      <View style={this.styles.root}>{this._background}{props.children}</View>
    ); 
  }
}
