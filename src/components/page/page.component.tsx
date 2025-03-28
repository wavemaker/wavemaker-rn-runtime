import React from 'react';
import { PanResponder, ScrollView, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, WmPageStyles } from './page.styles';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

export class WmPageState extends BaseComponentState<WmPageProps> {}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {
  private scrollRef: React.RefObject<any>;
  private previousScrollPosition: number = 0;

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

  private onScroll = (e: any)=>{
    const scrollPosition = e.nativeEvent.contentOffset.y;
    if(Math.abs(scrollPosition - this.previousScrollPosition) >= 8 && scrollPosition >=0){
      if (scrollPosition > this.previousScrollPosition) {
        e.scrollDirection = 1;
      } else if (scrollPosition === this.previousScrollPosition) {
        e.scrollDirection = 0;
      } else {
        e.scrollDirection = -1;
      }
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
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          const rootStyles = [this.styles.root, {paddingTop: 0 }]
          return props.scrollable ? 
          <ScrollView
            ref={this.scrollRef}
            {...this.panResponder.panHandlers}
            style={rootStyles}
            onScroll={this.onScroll}
            scrollEventThrottle={16}
          >
            {this._background}
            {props.children}
          </ScrollView> : 
          <View style={rootStyles}> 
            {this._background}
            {props.children}
          </View>
        }}
      </SafeAreaInsetsContext.Consumer>
    ); 
  }
}
