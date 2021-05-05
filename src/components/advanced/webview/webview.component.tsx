import React from 'react';
import { View, TextInput } from 'react-native';
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
        <TextInput
          style={this.styles.input}
          //@ts-ignore
          //onChange= {e => (this.proxy.src = e.nativeEvent.text)}
          value={props.src}
        />
        <WebView style={this.styles.webview} source={{
          uri: props.src
        }}></WebView>
      </View>
    ): null;
  }
}
