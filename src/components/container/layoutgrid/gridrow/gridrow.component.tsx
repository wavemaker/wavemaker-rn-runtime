import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmGridrowProps from './gridrow.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmGridRowStyles } from './gridrow.styles';

export class WmGridrowState extends BaseComponentState<WmGridrowProps> {

}

export default class WmGridrow extends BaseComponent<WmGridrowProps, WmGridrowState, WmGridRowStyles> {

  constructor(props: WmGridrowProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmGridrowProps());
  }

  renderWidget(props: WmGridrowProps) {
    return (
      <View style={this.styles.root}>{props.children}</View>
    ); 
  }
}
