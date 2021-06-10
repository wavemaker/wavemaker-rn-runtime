import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLayoutgridProps from './layoutgrid.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLayoutGridStyles } from './layoutgrid.styles';

export class WmLayoutgridState extends BaseComponentState<WmLayoutgridProps> {

}

export default class WmLayoutgrid extends BaseComponent<WmLayoutgridProps, WmLayoutgridState, WmLayoutGridStyles> {

  constructor(props: WmLayoutgridProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLayoutgridProps());
  }

  renderWidget(props: WmLayoutgridProps) {
    return (
      <View style={this.styles.root}>{props.children}</View>
    ); 
  }
}
