import React from 'react';
import { Linking, Text } from 'react-native';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmAnchorProps from './anchor.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './anchor.styles';

export default class WmAnchor extends BaseComponent<WmAnchorProps> {

  constructor(props: WmAnchorProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAnchorProps());
  }

  onTap() {
    const link = this.state.props.hyperlink;
    if (link) {
      Linking.openURL(link);
    } else {
      this.invokeEventCallback('onTap', [null, this.proxy]);
    }
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Tappable 
        onTap={() => this.onTap()}
        onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}>
          <Text style={this.styles.root}>{props.caption}</Text>
      </Tappable>
    ): null; 
  }
}
