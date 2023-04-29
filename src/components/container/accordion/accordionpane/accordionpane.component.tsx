import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmAccordionpaneProps from './accordionpane.props';
import { DEFAULT_CLASS, WmAccordionpaneStyles } from './accordionpane.styles';
import WmAccordion from '../accordion.component';

export class WmAccordionpaneState extends BaseComponentState<WmAccordionpaneProps> {
  isPartialLoaded = false;
}

export default class WmAccordionpane extends BaseComponent<WmAccordionpaneProps, WmAccordionpaneState, WmAccordionpaneStyles> {

  constructor(props: WmAccordionpaneProps) {
    super(props, DEFAULT_CLASS, new WmAccordionpaneProps());
  }

  onPaneExpand() {
    this.invokeEventCallback('onExpand', [null, this.proxy]);
  }

  onPaneCollapse() {
    this.invokeEventCallback('onCollapse', [null, this.proxy]);
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
      return props.renderPartial(this.onPartialLoad.bind(this));
    }
    return props.children;
  }
  renderWidget(props: WmAccordionpaneProps) {
    return (<View style={this.styles.root}>{this._background}{this.renderContent(props)}</View>);
  }
}
