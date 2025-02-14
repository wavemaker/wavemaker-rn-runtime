import React from 'react';
import { PanResponder, ScrollView, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, WmPageStyles } from './page.styles';
import { StickyViewContainer } from '@wavemaker/app-rn-runtime/core/sticky-container.component';

export class WmPageState extends BaseComponentState<WmPageProps> {}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {
  previousScrollPosition: number = 0;
  panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (e) => {
      this.notify('globaltouch', [e]);
      return false;
    },
  });
  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS, );
  }

  onScroll = (e: any)=>{
    const scrollPosition = e.nativeEvent.contentOffset.y;
    if (scrollPosition > this.previousScrollPosition) {
      e.scrollDirtection = 1;
    } else if (scrollPosition === this.previousScrollPosition) {
      e.scrollDirtection = 0;
    } else {
      e.scrollDirtection = -1;
    }
    this.previousScrollPosition = scrollPosition;
    this.notify('scroll', [e]);
  }

  renderWidget(props: WmPageProps) {
    return (
    <StickyViewContainer>
        <ScrollView
          contentContainerStyle={this.styles.root}
          {...this.panResponder.panHandlers}
          style={{height: '100%', width: '100%', flex:1}}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
        >
        <View style={this.styles.root}> 
          {this._background}
          {props.children}
        </View>
        </ScrollView>
    </StickyViewContainer>
    ); 
  }
}
