import React,{useCallback} from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { determineNavigationBarButtonStyle, hexWithAlpha } from '@wavemaker/app-rn-runtime/core/utils';


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
        {isEdgeToEdgeApp && Platform.OS === "android" && (
          <>
            <StatusBar barStyle={props.statusbarstyle} />
            <CustomNavigationBar
                style={props?.navigationbarstyle || 'light'}
                color={props?.navigationbarcolor || '#000000'}
                opacity={props?.navigationbaropacity || 0.1}
              />
          </>
         )
        }
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

type CustomNavigationBarProps = {
  style: 'dark' | 'light' | 'custom';
  color: string;
  opacity: number;
};

const CustomNavigationBar = (props:CustomNavigationBarProps) => {
  const {style,opacity,color} = props;

  useFocusEffect(
    useCallback(() => {
      let navbarColor: string;
      let buttonStyle: 'light' | 'dark';

      switch (style) {
        case 'custom':
          navbarColor = hexWithAlpha(color, opacity);
          // Determine button style based on color brightness
          buttonStyle = determineNavigationBarButtonStyle(color) ? 'light' : 'dark';
          break;
        
        case 'dark':
          navbarColor = '#0000001A'; // rgba(0,0,0,0.1) in hex
          buttonStyle = 'light';
          break;
        
        case 'light':
        default:
          navbarColor = '#FFFFFF80'; // rgba(255,255,255,0.5) in hex
          buttonStyle = 'dark';
          break;
      }
      NavigationBar.setBackgroundColorAsync(navbarColor);
      NavigationBar.setButtonStyleAsync(buttonStyle);
    }, [style, color, opacity])
  );

  return null;
};
