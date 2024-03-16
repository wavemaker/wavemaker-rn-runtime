import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabpaneProps from './tabpane.props';
import { DEFAULT_CLASS, WmTabpaneStyles } from './tabpane.styles';
import WmTabs from '../tabs.component';

export class WmTabpaneState extends BaseComponentState<WmTabpaneProps> {
  isPartialLoaded = false;
  isActive = false;
}

export default class WmTabpane extends BaseComponent<WmTabpaneProps, WmTabpaneState, WmTabpaneStyles> {

  constructor(props: WmTabpaneProps) {
    super(props, DEFAULT_CLASS, new WmTabpaneProps());
    this.subscribe('scroll', (event: any) => {
      return this.state.isActive;
    });
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
      return props.renderPartial(props, this.onPartialLoad.bind(this));
    }
    return props.children;
  }

  showView(): boolean {
    return this.isVisible() && this.state.isActive;
  }

  componentDidMount() {
    const tabs = (this.parent) as WmTabs;
    tabs.addTabPane(this.proxy as WmTabpane);
    super.componentDidMount();
  }

  _onSelect() {
    this.updateState({
      isActive: true
    } as WmTabpaneState);
    this.invokeEventCallback('onSelect', [null, this.proxy]);
  }
  _onDeselect() {
    this.updateState({
      isActive: false
    } as WmTabpaneState);
    this.invokeEventCallback('onDeselect', [null, this.proxy]);
  }

  select() {
    (this.parent as WmTabs).selectTabPane(this);
  }

  renderWidget(props: WmTabpaneProps) {
    return (<View style={this.styles.root}>
        {this._background}
        {this.renderContent(props)}
      </View>);
  }
}
