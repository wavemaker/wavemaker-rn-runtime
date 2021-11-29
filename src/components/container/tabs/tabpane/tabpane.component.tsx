import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabpaneProps from './tabpane.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTabpaneStyles } from './tabpane.styles';
import WmTabs from '../tabs.component';

export class WmTabpaneState extends BaseComponentState<WmTabpaneProps> {
  isPartialLoaded = false;
}

export default class WmTabpane extends BaseComponent<WmTabpaneProps, WmTabpaneState, WmTabpaneStyles> {

  constructor(props: WmTabpaneProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabpaneProps());
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [null, this]);
  }

  renderContent(props: WmTabpaneProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmTabpaneState);
        });
      }
      return props.renderPartial(this.onPartialLoad.bind(this));
    }
    return props.children;
  }

  componentDidMount() {
    const tabs = (this.parent) as WmTabs;
    tabs.addTabPane(this);
    super.componentDidMount();
  }

  _onSelect() {
    this.invokeEventCallback('onSelect', [null, this.proxy]);
  }
  _onDeselect() {
    this.invokeEventCallback('onDeselect', [null, this.proxy]);
  }

  renderWidget(props: WmTabpaneProps) {
    return (<View style={this.styles.root}>{this.renderContent(props)}</View>);
  }
}
