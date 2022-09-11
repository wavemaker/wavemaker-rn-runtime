import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPanelContentProps from './panel-content.props';
import { DEFAULT_CLASS, WmPanelContentStyles } from './panel-content.styles';

export class WmPanelContentState extends BaseComponentState<WmPanelContentProps> {}

export default class WmPanelContent extends BaseComponent<WmPanelContentProps, WmPanelContentState, WmPanelContentStyles> {

  constructor(props: WmPanelContentProps) {
    super(props, DEFAULT_CLASS, new WmPanelContentProps());
  }

  renderWidget(props: WmPanelContentProps) {
    return (<View style={this.styles.root}>{props.children}</View>); 
  }
}
