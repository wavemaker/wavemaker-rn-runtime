import React from 'react';
import { PanResponder, ScrollView, View, NativeSyntheticEvent,  NativeScrollEvent ,StatusBar, Platform} from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPageProps from './page.props';
import { DEFAULT_CLASS, WmPageStyles } from './page.styles';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { StickyViewComponents } from '@wavemaker/app-rn-runtime/core/sticky-view.component';
import { FixedViewContainer } from '@wavemaker/app-rn-runtime/core/fixed-view.component';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';

export class WmPageState extends BaseComponentState<WmPageProps> {}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {
  private appConfig = injector.get<AppConfig>('APP_CONFIG');

  panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (e) => {
      this.notify('globaltouch', [e]);
      return false;
    },
  });
  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS);
  }

  renderWidget(props: WmPageProps) {

    const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
    return (
      <StickyViewComponents hasAppnavbar={props.hasappnavbar} onscroll={props.onscroll} notifier={this.notifier}>
        <FixedViewContainer>
        {isEdgeToEdgeApp && Platform.OS ==="android" ? <StatusBar barStyle={props.barstyle}/> : null}
          <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
              return <View style={[{paddingTop : !props?.hasappnavbar && isEdgeToEdgeApp ? insets?.top : 0 },this.styles.root]} {...this.panResponder.panHandlers}> 
                {this._background}
                {props.children}
              </View>
            }}
          </SafeAreaInsetsContext.Consumer>
        </FixedViewContainer>
      </StickyViewComponents>
    ); 
  }
}
