import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCompositeProps from './composite.props';
import { DEFAULT_CLASS, WmCompositeStyles } from './composite.styles';

export class WmCompositeState extends BaseComponentState<WmCompositeProps> {}

export default class WmComposite extends BaseComponent<WmCompositeProps, WmCompositeState, WmCompositeStyles> {

  constructor(props: WmCompositeProps) {
    super(props, DEFAULT_CLASS, new WmCompositeProps());
  }

  renderWidget(props: WmCompositeProps) {
    return (<View style={this.styles.root}>{this._background}{props.children}</View>); 
  }
}
