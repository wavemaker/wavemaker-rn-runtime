import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmFormBodyProps from './form-body.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormBodyStyles } from './form-body.styles';

export class WmFormBodyState extends BaseComponentState<WmFormBodyProps> {}

export default class WmFormBody extends BaseComponent<WmFormBodyProps, WmFormBodyState, WmFormBodyStyles> {

  constructor(props: WmFormBodyProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormBodyProps());
  }

  renderWidget(props: WmFormBodyProps) {
    return (<View style={this.styles.root}>{props.children}</View>); 
  }
}