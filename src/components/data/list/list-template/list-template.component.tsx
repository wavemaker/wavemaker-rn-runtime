import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmListTemplateProps from './list-template.props';
import { DEFAULT_CLASS, WmListTemplateStyles } from './list-template.styles';

export class WmListTemplateState extends BaseComponentState<WmListTemplateProps> {

}

export default class WmListTemplate extends BaseComponent<WmListTemplateProps, WmListTemplateState, WmListTemplateStyles> {

  constructor(props: WmListTemplateProps) {
    super(props, DEFAULT_CLASS, new WmListTemplateProps());
  }

  renderWidget(props: WmListTemplateProps) {
    return (
      <View style={this.styles.root}>{this._background}{props.children}</View>
    ); 
  }
}
