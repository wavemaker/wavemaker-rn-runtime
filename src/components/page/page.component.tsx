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
import * as NavigationBar from 'expo-navigation-bar';
import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';
import WmOfflineBanner from '@wavemaker/app-rn-runtime/components/advanced/offline-banner/offline-banner.component';
import BasePage from '@wavemaker/app-rn-runtime/runtime/base-page.component';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class WmPageState extends BaseComponentState<WmPageProps> {
  isConnected?: boolean;
}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {
  private appConfig = injector.get<AppConfig>('APP_CONFIG');
  private _unsubscribeNetworkState: any;
  private _unsubscribeNetworkError: any;

  panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (e) => {
      this.notify('globaltouch', [e]);
      return false;
    },
  });
  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS);
    this.state = {
            ...this.state,
            isConnected: true
        } as WmPageState;
  
  }

  componentDidMount() {
    super.componentDidMount();
    this.setNavigationBarColor();
    if(this.props.showOfflineBanner) {
      this.setupNetworkMonitoring();
    }
  }

  componentDidUpdate(prevProps: WmPageProps, prevState: WmPageState) {
    super.componentDidUpdate(prevProps, prevState)
    if (prevProps.navigationbarstyle !== this.props.navigationbarstyle) {
      this.setNavigationBarColor();
    }
  }

  private setupNetworkMonitoring(): void {
    this.cleanup.push(NetworkService.notifier.subscribe('onNetworkStateChange', (networkState: any) => {
      const connected = networkState.isConnected && networkState.isNetworkAvailable;
      if (this.state.isConnected !== connected) {
          this.setState({ ...this.state, isConnected: connected } as WmPageState);
      }
   })); 
    const currentState = NetworkService.getState();
    if (currentState) {
        const connected = currentState.isConnected && currentState.isNetworkAvailable;
        this.setState({ ...this.state, isConnected: connected } as WmPageState);
    }
}

  setNavigationBarColor() {
    const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
    if (Platform.OS !== 'android' || !isEdgeToEdgeApp) return;
    
    const isDark = this.props.navigationbarstyle === 'dark';
    const navbarColor = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)';
      
    const buttonStyle = isDark ? 'light' : 'dark';

    NavigationBar.setBackgroundColorAsync(navbarColor);
    NavigationBar.setButtonStyleAsync(buttonStyle);
  }

  onNetworkRetry() {
    if(!NetworkService.isConnected()) {
      return;
    }
    this.setState({ ...this.state, isConnected: true } as WmPageState);
  }

  private renderOfflineBanner() {
    return (
      <WmOfflineBanner onRetry={() => {
        this.onNetworkRetry();
        (this.props.listener as BasePage).onNetworkRetry();
      }} />
    );
  }

  renderWidget(props: WmPageProps) {

    if (!isWebPreviewMode() && props.showOfflineBanner && !this.state.isConnected) {
      return this.renderOfflineBanner();
    }

    const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
    return (
      <StickyViewComponents hasAppnavbar={props.hasappnavbar} onscroll={props.onscroll} notifier={this.notifier}>
        <FixedViewContainer>
        {isEdgeToEdgeApp && Platform.OS ==="android" ? <StatusBar barStyle={props.statusbarstyle}/> : null}
          <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
              return (
                <View 
                  {...this.getTestProps()}
                  style={[{paddingTop : !props?.hasappnavbar && isEdgeToEdgeApp ? insets?.top : 0 },this.styles.root]} 
                  {...this.panResponder.panHandlers}
                > 
                  {this._background}
                  {props.children}
                </View> 
              )
            }}
          </SafeAreaInsetsContext.Consumer>
        </FixedViewContainer>
      </StickyViewComponents>
    ); 
  }
}
