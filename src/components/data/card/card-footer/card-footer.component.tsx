import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCardFooterProps from './card-footer.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCardFooterStyles } from './card-footer.styles';

export class WmCardFooterState extends BaseComponentState<WmCardFooterProps> {}

export default class WmCardFooter extends BaseComponent<WmCardFooterProps, WmCardFooterState, WmCardFooterStyles> {

  constructor(props: WmCardFooterProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCardFooterProps());
  }

  renderWidget(props: WmCardFooterProps) {
    return (<View style={this.styles.root}>{props.children}</View>); 
  }
}
