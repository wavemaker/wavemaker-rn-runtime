import React, { useCallback, useMemo, useState } from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmAccordionpaneProps from './accordionpane.props';
import { DEFAULT_CLASS, WmAccordionpaneStyles } from './accordionpane.styles';
import WmAccordion from '../accordion.component';
import { View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { CollapsiblePane } from '../../panel/collapsible-pane.component';

export class WmAccordionpaneState extends BaseComponentState<WmAccordionpaneProps> {
  isPartialLoaded = false;
  collapsed = true;
}

export default class WmAccordionpane extends BaseComponent<WmAccordionpaneProps, WmAccordionpaneState, WmAccordionpaneStyles> {

  constructor(props: WmAccordionpaneProps) {
    super(props, DEFAULT_CLASS, new WmAccordionpaneProps(), new WmAccordionpaneState());
  }

  isCollapsed() {
    return this.state.collapsed;
  }
  
  show() {
    this.updateState({
      collapsed: false
    } as WmAccordionpaneState);
    this.invokeEventCallback('onExpand', [null, this.proxy]);
  }

  hide() {
    this.updateState({
      collapsed: true
    } as WmAccordionpaneState);
    this.invokeEventCallback('onCollapse', [null, this.proxy]);
  }

  expand() {
    (this.parent as WmAccordion).expand(this.props.name || '');
  }

  collapse() {
    (this.parent as WmAccordion).expand(this.props.name || '');
  }

  componentDidMount() {
    const accordion = (this.parent) as WmAccordion;
    accordion.addAccordionPane(this);
    super.componentDidMount();
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [this]);
  }

  renderContent(props: WmAccordionpaneProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmAccordionpaneState);
        });
      }
      return props.renderPartial(props, this.onPartialLoad.bind(this));
    }
    return props.children;
  }
  renderWidget(props: WmAccordionpaneProps) {
    return isWebPreviewMode() ? 
    (<View style={this.state.collapsed ? {maxHeight: 0, overflow: 'hidden'} : {}}>
      {this._background}
      {this.renderContent(props)}
    </View>) :
    (<CollapsiblePane close={this.state.collapsed}>
      {this._background}
      {this.renderContent(props)}
    </CollapsiblePane>);
  }
}
