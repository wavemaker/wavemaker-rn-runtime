import React, { createRef, RefObject } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, WmPageContentStyles } from './page-content.styles';
import { ScrollView } from 'react-native-gesture-handler';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {

}

export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {
  private scrollRef: RefObject<any>;

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, new WmPageContentProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
    this.scrollRef = createRef();
    this.subscribe('scrollToPosition', (args: any) => {
      this.scrollTo(args)
    })

    this.subscribe('scrollToEnd', () => {
      this.scrollRef?.current.scrollToEnd();
    })
  }

  public scrollTo(position: {x: number, y: number}){
    this.scrollRef?.current.scrollTo({
      x: position.x,
      y: position.y,
      Animated: true
    });
  }

  public renderSkeleton(props: WmPageContentProps): React.ReactNode {
    if(this.props.skeletonanimationresource) {
      return <View style={[{width: '100%'}, this.styles.root]}>
       <WmLottie styles={{ content: {...this.styles.root, ...this.styles.skeleton.root} }} source={this.props.skeletonanimationresource} loop={true} autoplay={true} speed={this.props.skeletonanimationspeed}/>
      </View>
    } 
    return null;
  }  

  renderWidget(props: WmPageContentProps) {
    const showScrollbar = (this.styles.root as any).scrollbarColor != 'transparent';
    //     return ((props.scrollable || isWebPreviewMode()) && !this._showSkeleton) ? (
      return (props.scrollable || isWebPreviewMode()) ? (
        <View style={{height: '100%', width: '100%', backgroundColor: this._showSkeleton && this.styles.skeleton.root.backgroundColor ? this.styles.skeleton.root.backgroundColor : this.styles.root.backgroundColor}}>
        {this._background}
        <SafeAreaInsetsContext.Consumer>
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          const keyboardOffset = insets?.bottom || 0;
          const verticalOffset = Platform.OS === 'ios' ? keyboardOffset + 100 : keyboardOffset;
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={verticalOffset}
              style={{ flex: 1 }}>
              <ScrollView 
                ref={this.scrollRef}
                contentContainerStyle={[this.styles.root, {backgroundColor: 'transparent'}]}
                showsVerticalScrollIndicator={showScrollbar}
                onScroll={(event) => {this.notify('scroll', [event])}}
                scrollEventThrottle={48}>
                {props.children}
              </ScrollView>
            </KeyboardAvoidingView>
          )}}
      </SafeAreaInsetsContext.Consumer>
      </View>      
      ) : (
        <View style={[this.styles.root,
            {backgroundColor: this._showSkeleton ?
              this.styles.skeleton.root.backgroundColor : 
              this.styles.root.backgroundColor}]}>
          <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
              const keyboardOffset = insets?.bottom || 0;
              const verticalOffset = Platform.OS === 'ios' ? keyboardOffset + 100 : keyboardOffset;
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
      