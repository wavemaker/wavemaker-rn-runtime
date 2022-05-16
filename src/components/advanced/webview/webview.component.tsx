import React from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWebviewProps from './webview.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WebviewStyles } from './webview.styles';

class WmWebViewState extends BaseComponentState<WmWebviewProps> {

}

export default class WmWebview extends BaseComponent<WmWebviewProps, WmWebViewState, WebviewStyles> {

  constructor(props: WmWebviewProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmWebviewProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
  }

  getTitle(iframe: any) {
    try {
      return iframe.currentTarget.contentWindow.document.title;
    } catch(e) {
      // browser blocks cross origin access to iframe content.
    }
  }

  setTitle(title: string) {
    this.updateState({
      props: {
        title: title
      }
    } as WmWebViewState);
  }

  protected renderWidget(props: WmWebviewProps) {
    return (
      <View style={this.styles.root}>
        {Platform.OS === 'web' ?
          (<iframe src={props.src} width={'100%'} height={'100%'} onLoad={(e) => {
            this.setTitle(this.getTitle(e.currentTarget));
            this.invokeEventCallback('onLoad', [null, this]);
          }}></iframe>) : 
          (<WebView 
            style={this.styles.webview}
            source={{
              uri: props.src
            }}
            onLoadEnd={(e) => {
              this.setTitle(e.nativeEvent.title);
              this.invokeEventCallback('onLoad', [null, this]);
            }}>
          </WebView>)}
      </View>
    );
  }
}
