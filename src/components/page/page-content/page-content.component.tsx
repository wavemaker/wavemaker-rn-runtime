import React, { createRef, RefObject, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, WmPageContentStyles } from './page-content.styles';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { StickyWrapperContextType, StickyWrapperContext } from '@wavemaker/app-rn-runtime/core/sticky-wrapper';
import { isNumber } from 'lodash-es';
import WmOfflineBanner from '@wavemaker/app-rn-runtime/components/advanced/offline-banner/offline-banner.component';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {
  navHeightForRender = 0;
  bottomTabHeightForRender = 0;
}
export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {
  private scrollRef: RefObject<any>;
  static contextType = StickyWrapperContext;
  private _unsubscribeNavHeight : any;

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, new WmPageContentProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
    this.scrollRef = createRef();
  
    this.state = {
      ...this.state,
      navHeightForRender: 0,
      bottomTabHeightForRender: 0,
    };

    this.subscribe('scrollToPosition', (args: any) => {
      this.scrollTo(args);
    });

    this.subscribe('scrollToEnd', () => {
      this.scrollRef?.current?.scrollToEnd();
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this._unsubscribeNavHeight = this.subscribe('updateNavHeight', (navHeightValue: number) => {
      if (this.state.navHeightForRender !== navHeightValue) {
        this.setState({ navHeightForRender: navHeightValue });
      }
      return null;
    });
    if (this.context && (this.context as StickyWrapperContextType).navHeight) {
      this.setState({ navHeightForRender: (this.context as StickyWrapperContextType).navHeight.value });
    }

    this._unsubscribeNavHeight = this.subscribe('updateBottomTabHeight', (bottomTabHeightValue: number) => {
      if (this.state.bottomTabHeightForRender !== bottomTabHeightValue) {
        this.setState({ bottomTabHeightForRender: bottomTabHeightValue });
      }
      return null;
    });
    if (this.context && (this.context as StickyWrapperContextType).bottomTabHeight) {
      this.setState({ bottomTabHeightForRender: (this.context as StickyWrapperContextType).bottomTabHeight.value });
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this._unsubscribeNavHeight) this._unsubscribeNavHeight();
  }

  public scrollTo(position: {x: number, y: number}){
    this.scrollRef?.current?.scrollTo({
      x: position.x,
      y: position.y,
      animated: true
    });
  }

  private handleOnScrollEndDrag = (event: any) => {
    if(this.context) {
      const { onScrollEndDrag, scrollDirection } = this.context as StickyWrapperContextType;
      const scrollPosition = event?.nativeEvent?.contentOffset?.y;
      if (scrollPosition >= 0) {
        if(scrollDirection.value > 0) {
          this.invokeEventCallback('onSwipeup', [null, this.proxy]);
        }else {
          this.invokeEventCallback('onSwipedown', [null, this.proxy]);
        }
        onScrollEndDrag(this.scrollRef);
      }
    }
  }

  public renderSkeleton(props: WmPageContentProps): React.ReactNode {
    if(this.props.skeletonanimationresource) {
      return <View style={[{width: '100%'}, this.styles.root]}>
       <WmLottie styles={{ content: {...this.styles.root, ...this.styles.skeleton.root} }} source={this.props.skeletonanimationresource} loop={true} autoplay={true} speed={this.props.skeletonanimationspeed}/>
      </View>
    } 
    return null;
  }

  private handleScrollViewLayout = () => {
    requestAnimationFrame(() => {
        this.notify('updateStickyHeaders', []);
    });
  }

  renderWidget(props: WmPageContentProps) {
    // Show offline banner when not connected (skip in web preview)
    if (!isWebPreviewMode() && !props.isconnected) {
      return (
        <WmOfflineBanner onRetry={() => {
          this.notify('retry', []);
        }} />
      );
    }

    const showScrollbar = (this.styles.root as any).scrollbarColor != 'transparent';
    const borderRadiusStyles = {
      borderRadius: this.styles.root.borderRadius,
      borderTopLeftRadius: this.styles.root.borderTopLeftRadius,
      borderTopRightRadius: this.styles.root.borderTopRightRadius,
      borderBottomLeftRadius: this.styles.root.borderBottomLeftRadius,
      borderBottomRightRadius: this.styles.root.borderBottomRightRadius,
    };
    return (props.scrollable || isWebPreviewMode()) ? (
      <View style={{height: '100%', width: '100%',
         ...borderRadiusStyles,
       backgroundColor: this._showSkeleton && this.styles.skeleton.root.backgroundColor ? this.styles.skeleton.root.backgroundColor : this.styles.root.backgroundColor
      
       }}>
        {this._background}
        <SafeAreaInsetsContext.Consumer>
          {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
            const keyboardOffset = props.consumenotch ? (insets?.bottom || 0) : 0;
            const verticalOffset = Platform.OS === 'ios' ? keyboardOffset + props.keyboardverticaloffset : keyboardOffset;
            const paddingTop = this.styles?.root?.paddingTop || this.styles?.root?.padding;
            const paddingBottom = this.styles?.root?.paddingBottom || this.styles?.root?.padding;
            const paddingTopVal = isNumber(paddingTop) ? paddingTop : 0;
            const paddingBottomVal = isNumber(paddingBottom) ? paddingBottom : 0;
            const navHeightVal = (this.props.onscroll == 'topnav' || this.props.onscroll == 'topnav-bottomnav') ? this.state.navHeightForRender : 0;
            const bottomTabHeightVal = this.props.onscroll == 'topnav-bottomnav' ? this.state.bottomTabHeightForRender : 0;
            return (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={verticalOffset}
                style={{ flex: 1 }}>
                  <Animated.ScrollView
                    keyboardShouldPersistTaps={props.keyboardpersisttaps}
                    testID={this.getTestId("page_content_scrollview")}
                    ref={this.scrollRef}
                    contentContainerStyle={[
                      this.styles.root, {backgroundColor: 'transparent', 
                        paddingTop: navHeightVal + paddingTopVal, 
                        paddingBottom: bottomTabHeightVal + paddingBottomVal
                      }
                    ]}
                    onLayout={this.handleScrollViewLayout}
                    showsVerticalScrollIndicator={showScrollbar}
                    onScroll={this.context && (this.context as StickyWrapperContextType).onScroll ? 
                      (this.context as StickyWrapperContextType).onScroll 
                      : ()=>{}
                    }
                    alwaysBounceVertical={false}
                    alwaysBounceHorizontal={false}
                    bounces={false}
                    overScrollMode="never"
                    removeClippedSubviews={Platform.OS == 'android'}
                    onScrollEndDrag={this.handleOnScrollEndDrag}
                  >
                    {props.children}
                  </Animated.ScrollView>
              </KeyboardAvoidingView>
            )
          }}
        </SafeAreaInsetsContext.Consumer>
      </View>      
    ) : (
      <View style={[this.styles.root,
          {backgroundColor: this._showSkeleton ?
            this.styles.skeleton.root.backgroundColor : 
            this.styles.root.backgroundColor}]}>
        <SafeAreaInsetsContext.Consumer>
          {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
            const keyboardOffset = props.consumenotch ? (insets?.bottom || 0) : 0;
            const verticalOffset = Platform.OS === 'ios' ? keyboardOffset + props.keyboardverticaloffset : keyboardOffset;
            return (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={verticalOffset}
                style={{ flex: 1 }}>
                {this._background}
                {props.children}
              </KeyboardAvoidingView>
            )}}
        </SafeAreaInsetsContext.Consumer>
      </View>
    );
  }
}