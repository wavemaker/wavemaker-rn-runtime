import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabpaneProps from './tabpane.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTabpaneStyles } from './tabpane.styles';
import WmContainerProps from "@wavemaker/app-rn-runtime/components/container/container.props";

export class WmTabpaneState extends BaseComponentState<WmTabpaneProps> {}

export default class WmTabpane extends BaseComponent<WmTabpaneProps, WmTabpaneState, WmTabpaneStyles> {

  constructor(props: WmTabpaneProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabpaneProps());
  }

  renderContent(props: WmContainerProps) {
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

  onSelect() {
    this.invokeEventCallback('onSelect', [null, this.proxy]);
  }
  onDeselect() {
    this.invokeEventCallback('onDeselect', [null, this.proxy]);
  }

  renderWidget(props: WmTabpaneProps) {
    return (<View style={this.styles.root}>{this.renderContent(props)}</View>);
  }
}
