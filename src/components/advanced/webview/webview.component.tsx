import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { WebView, WebViewNavigation, WebViewMessageEvent } from 'react-native-webview';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWebviewProps from './webview.props';
import { DEFAULT_CLASS, WebviewStyles } from './webview.styles';

class WmWebViewState extends BaseComponentState<WmWebviewProps> {

}

export default class WmWebview extends BaseComponent<WmWebviewProps, WmWebViewState, WebviewStyles> {

  private webview: WebView | null = null as any;
  private webViewState: WebViewNavigation = null as any;
  private invokeJSCallbacks = {} as any;

  constructor(props: WmWebviewProps) {
    super(props, DEFAULT_CLASS, new WmWebviewProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPress);
  }

  handleBackButtonPress = (): boolean => {
    if (this.webview && this.webViewState && this.webViewState.canGoBack) {
      this.webview.goBack();
      return true;
    }
    return false;
  }

  injectJavaScript(fn: Function | string) {
    const fnStr = typeof fn === 'string' ? fn : `(${fn})()`;
    return new Promise((resolve, reject) => {
      if (this.webview) {
        const id = '' + Date.now();
        this.invokeJSCallbacks[id] = resolve;
        this.webview.injectJavaScript(
          `window.ReactNativeWebView.postMessage('afterInjectJavaScript:' + ${id} + ':' + JSON.stringify(${fnStr}))`
        );
      } else {
        reject();
      }
    });
  }

  parseResult(result: string) {
    try {
      return JSON.parse(result);
    } catch(e) {
      if (result === 'undefined' || result === 'null') {
        return null;
      }
      return result;
    }
  }

  onMessage = (event: WebViewMessageEvent) => {
    const data: string = event.nativeEvent?.data;
    if (data && data.startsWith('afterInjectJavaScript')) {
      const id = data?.match(/\:([0-9]+)\:/);
      const callback = id && this.invokeJSCallbacks[id[1]];
      const result = data.substring(data.indexOf(':', data.indexOf(':') + 1) + 1);
      callback && callback(this.parseResult(result));
    } else {
      this.invokeEventCallback('onMessage', [event, this]);
    }
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
            this.invokeEventCallback('onLoad', [e, this]);
          }}></iframe>) :
          (<WebView
            ref={(ref) => this.webview = ref}
            nestedScrollEnabled={true}
            style={this.styles.webview}
            source={{
              uri: props.src
            }}
            incognito={props.incognito}
            onMessage={this.onMessage}
            onNavigationStateChange={(state) => {
              this.webViewState = state;
            }}
            onLoadEnd={(e) => {
              this.setTitle(e.nativeEvent.title);
              this.invokeEventCallback('onLoad', [e, this]);
            }}>
          </WebView>)}
      </View>
    );
  }
}
