import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmAccordionpaneProps from './accordionpane.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAccordionpaneStyles } from './accordionpane.styles';

export class WmAccordionpaneState extends BaseComponentState<WmAccordionpaneProps> {}

export default class WmAccordionpane extends BaseComponent<WmAccordionpaneProps, WmAccordionpaneState, WmAccordionpaneStyles> {

  constructor(props: WmAccordionpaneProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAccordionpaneProps());
  }

  onPaneExpand() {
    this.invokeEventCallback('onExpand', [null, this.proxy]);
  }

  onPaneCollapse() {
    this.invokeEventCallback('onCollapse', [null, this.proxy]);
  }

  renderContent(props: WmAccordionpaneProps) {
    if (props.renderPartial) {
      if (!this.state.props.isPartialLoaded) {
        this.state.props.isPartialLoaded = true;
        setTimeout(() => {
          this.invokeEventCallback('onLoad', [null, this]);
        });
      }
      return props.renderPartial();
    }
    return props.children;
  }
  renderWidget(props: WmAccordionpaneProps) {
    return (<View style={this.styles.root}>{this.renderContent(props)}</View>);
  }
}
