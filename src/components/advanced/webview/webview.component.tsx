import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWebviewProps from './webview.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WebviewStyles } from './webview.styles';

export default class WmWebview extends BaseComponent<WmWebviewProps, BaseComponentState<WmWebviewProps>, WebviewStyles> {

  constructor(props: WmWebviewProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmWebviewProps());
  }

  protected renderWidget(props: WmWebviewProps) {
    return (
      <View style={this.styles.container}>
        <WebView 
          style={this.styles.webview}
          source={{
            uri: props.src
          }}>
        </WebView>
      </View>
    );
  }
}
