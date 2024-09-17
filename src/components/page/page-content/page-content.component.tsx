import React from 'react';
import { View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, WmPageContentStyles } from './page-content.styles';
import { ScrollView } from 'react-native-gesture-handler';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {

}

export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, new WmPageContentProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
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
        <ScrollView contentContainerStyle={[this.styles.root, {backgroundColor: 'transparent'}]}
          showsVerticalScrollIndicator={showScrollbar}
          onScroll={(event) => {this.notify('scroll', [event])}}
          scrollEventThrottle={48}>
          {props.children}
        </ScrollView>
      </View>
    ) : (
      <View style={[this.styles.root, 
        {backgroundColor: this._showSkeleton ? 
        this.styles.skeleton.root.backgroundColor : 
        this.styles.root.backgroundColor}]}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
