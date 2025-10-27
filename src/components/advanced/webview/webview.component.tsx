import React from 'react';
import { BackHandler, Platform, View, NativeEventSubscription } from 'react-native';
import { WebView, WebViewNavigation, WebViewMessageEvent } from 'react-native-webview';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWebviewProps from './webview.props';
import { DEFAULT_CLASS, WebviewStyles } from './webview.styles';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { isAndroid, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

class WmWebViewState extends BaseComponentState<WmWebviewProps> {
  currentTarget = {
    title: '',
    src: ''
  };

}

export default class WmWebview extends BaseComponent<WmWebviewProps, WmWebViewState, WebviewStyles> {

  private webview: WebView | null = null as any;
  private webViewState: WebViewNavigation = null as any;
  private invokeJSCallbacks = {} as any;
  private backHandlerSubscription: NativeEventSubscription | null = null;

  constructor(props: WmWebviewProps) {
    super(props, DEFAULT_CLASS, new WmWebviewProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
    if (isAndroid() && !isWebPreviewMode()) {
      this.backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.backHandlerSubscription) {
      this.backHandlerSubscription.remove();
      this.backHandlerSubscription = null;
    }
  }

  handleBackButtonPress = (): boolean => {
    if (this.webview && this.webViewState && this.webViewState.canGoBack) {
      this.webview.goBack();
      return true;
    }
    return false;
  }

  get title() {
    return this.state.currentTarget?.title;
  }

  get currentsrc() {
    return this.state.currentTarget?.src;
  }

  executeScript(fn: string) {
    return new Promise((resolve, reject) => {
      if (this.webview) {
        const id = '' + Date.now();
        this.invokeJSCallbacks[id] = resolve;
        fn = `
         (function(){
          try{
            return (${fn});
          } catch(e) {
            return e.getMessage();
          }
         }())
        `;
        this.webview.injectJavaScript(
          `window.ReactNativeWebView.postMessage('afterInjectJavaScript:' + ${id} + ':' + JSON.stringify(${fn}))`
        );
      } else {
        reject();
      }
    });
  }

  insertCSS(style = '') {
    style = style.replace(/[\n\t\r]/g, '');
    return this.executeScript(`
    function() {
      const style = document.createElement('style');
      style.innerHTML = '${style}';
      document.head.appendChild(style);
      return 'SUCCESS';
    }()
    `);
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

  public onLoad(e: any, title: string, src: string) {
    this.updateState({
      currentTarget: {
        title: title,
        src: src
      }
    } as WmWebViewState, () => {
      this.invokeEventCallback('onLoad', [e, this]);
    });
  }

  protected renderWidget(props: WmWebviewProps) {
    return (
      <View 
        style={this.styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        {Platform.OS === 'web' ?
          (<iframe src={props.src} width={'100%'} height={'100%'}
            onLoad={(e) => this.onLoad(e, this.getTitle(e.currentTarget), (e.currentTarget as any).src)}></iframe>) :
          (<WebView
            ref={(ref) => this.webview = ref}
            nestedScrollEnabled={true}
            containerStyle = {this.styles.webview}
            // style={this.styles.webview} // when using style, there are some inconsistencies observed in Android. containerStyle gives us a uniformity in IOS and Android.
            source={{
              uri: props.src
            }}
            testID={this.getTestId('web_view')}
            {...getAccessibilityProps(AccessibilityWidgetType.WEBVIEW, props)}
            incognito={props.incognito}
            onMessage={this.onMessage}
            sharedCookiesEnabled={true}
            onNavigationStateChange={(state) => {
              this.webViewState = state;
            }}
            scrollEnabled={true}
            onLoadEnd={(e) => this.onLoad(e, e.nativeEvent.title, e.nativeEvent.url)}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
          >
          </WebView>)}
      </View>
    );
  }
}
