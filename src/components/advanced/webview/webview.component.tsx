import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

import WmWebviewProps from './webview.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './webview.styles';

export default class WmWebview extends BaseComponent<WmWebviewProps> {

  constructor(props: WmWebviewProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmWebviewProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <View style={this.styles.container}>
        <WebView 
          style={this.styles.webview}
          source={{
            uri: props.src
          }}>
        </WebView>
      </View>
    ): null;
  }
}
