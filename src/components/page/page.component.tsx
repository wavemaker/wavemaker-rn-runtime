import React from 'react';
import { PanResponder, ScrollView, View, NativeSyntheticEvent,  NativeScrollEvent ,StatusBar, Platform} from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, WmPageStyles } from './page.styles';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { StickyViewContainer } from '@wavemaker/app-rn-runtime/core/sticky-container.component';
import { FixedViewContainer } from '@wavemaker/app-rn-runtime/core/fixed-view.component';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';

export class WmPageState extends BaseComponentState<WmPageProps> {}

interface CustomScrollEvent {
  scrollDirection: number;
  scrollDelta: number;
}


export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {
  private scrollRef: React.RefObject<any>;
  private previousScrollPosition: number = 0;
  private appConfig = injector.get<AppConfig>('APP_CONFIG');

  panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (e) => {
      this.notify('globaltouch', [e]);
      return false;
    },
  });
  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS, );
    this.scrollRef = React.createRef();
  }

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>)=>{
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const scrollDelta = Math.abs(scrollPosition - this.previousScrollPosition)  
    if(scrollPosition >=0){
      const e = event as unknown as CustomScrollEvent;
      if (scrollPosition > this.previousScrollPosition) {
        e.scrollDirection = 1;
      } else if (scrollPosition === this.previousScrollPosition) {
        e.scrollDirection = 0;
      } else {
        e.scrollDirection = -1;
      }
      e.scrollDelta = scrollDelta;
      this.previousScrollPosition = scrollPosition;
      this.notify('scroll', [e]);
    }
  }

  public scrollTo(position: {x: number, y: number}){
    this.scrollRef?.current?.scrollTo({
      x: position.x,
      y: position.y,
      Animated: true
    });
  }

  renderWidget(props: WmPageProps) {

    const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
    return (
      <StickyViewContainer>
        <FixedViewContainer>
        {isEdgeToEdgeApp && Platform.OS ==="android" ? <StatusBar barStyle={props.barstyle}/> : null}
        <SafeAreaInsetsContext.Consumer>
          {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
            return props.scrollable ? 
            <ScrollView
              ref={this.scrollRef}
              {...this.panResponder.panHandlers}
              style={[{ width:'100%', height:'100%', paddingTop : !props?.hasappnavbar && isEdgeToEdgeApp ? insets?.top : 0 }, this.styles.root]}
              contentContainerStyle={{flexGrow: 1}}
              onScroll={this.onScroll}
              scrollEventThrottle={16}
            >
              {this._background}
              {props.children}
            </ScrollView> : 
            <View style={[{paddingTop : !props?.hasappnavbar && isEdgeToEdgeApp ? insets?.top : 0 },this.styles.root]}> 
              {this._background}
              {props.children}
            </View>
          }}
        </SafeAreaInsetsContext.Consumer>
        </FixedViewContainer>
     </StickyViewContainer>
    ); 
  }
}
