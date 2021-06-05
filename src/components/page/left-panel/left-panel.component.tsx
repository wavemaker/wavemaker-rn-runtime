import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLeftPanelProps from './left-panel.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLeftPanelStyles } from './left-panel.styles';
import { ScrollView } from 'react-native-gesture-handler';

export class WmLeftPanelState extends BaseComponentState<WmLeftPanelProps> {

}

export default class WmLeftPanel extends BaseComponent<WmLeftPanelProps, WmLeftPanelState, WmLeftPanelStyles> {

  constructor(props: WmLeftPanelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLeftPanelProps());
  }

  renderContent(props: WmLeftPanelProps) {
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

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <ScrollView contentContainerStyle={this.styles.root}>
        {this.renderContent(props)}
      </ScrollView>
    ): null; 
  }
}
