import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPanelFooterProps from './panel-footer.props';
import { DEFAULT_CLASS, WmPanelFooterStyles } from './panel-footer.styles';

export class WmPanelFooterState extends BaseComponentState<WmPanelFooterProps> {}

export default class WmPanelFooter extends BaseComponent<WmPanelFooterProps, WmPanelFooterState, WmPanelFooterStyles> {

  constructor(props: WmPanelFooterProps) {
    super(props, DEFAULT_CLASS, new WmPanelFooterProps());
  }

  renderWidget(props: WmPanelFooterProps) {
    return (<View style={this.styles.root}>{this._background}{props.children}</View>);
  }
}
