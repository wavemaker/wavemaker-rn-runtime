import React from 'react';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLeftPanelProps from './left-panel.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './left-panel.styles';
import { ScrollView } from 'react-native-gesture-handler';

export default class WmLeftPanel extends BaseComponent<WmLeftPanelProps> {

  constructor(props: WmLeftPanelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLeftPanelProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <ScrollView contentContainerStyle={this.styles.root}>
        {props.children}
      </ScrollView>
    ): null; 
  }
}
