import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLeftPanelProps from './left-panel.props';
import { DEFAULT_CLASS, WmLeftPanelStyles } from './left-panel.styles';
import { ScrollView } from 'react-native-gesture-handler';

export class WmLeftPanelState extends BaseComponentState<WmLeftPanelProps> {
  isPartialLoaded = false;
}

export default class WmLeftPanel extends BaseComponent<WmLeftPanelProps, WmLeftPanelState, WmLeftPanelStyles> {

  constructor(props: WmLeftPanelProps) {
    super(props, DEFAULT_CLASS, new WmLeftPanelProps());
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [null, this]);
  }

  renderContent(props: WmLeftPanelProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmLeftPanelState);
        });
      }
      return props.renderPartial(props, this.onPartialLoad.bind(this));
    }
    return props.children;
  }

  renderWidget(props: WmLeftPanelProps) {
    return (
      <ScrollView 
        onScroll={(event) => {this.notify('scroll', [event])}}
        scrollEventThrottle={48}
        contentContainerStyle={this.styles.root}>
        {this._background}
        {this.renderContent(props)}
      </ScrollView>
    );
  }
}
