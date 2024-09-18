import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPartialProps from './partial.props';
import { DEFAULT_CLASS, WmPartialStyles } from './partial.styles';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export class WmPartialState extends BaseComponentState<WmPartialProps> {

}

export default class WmPartial extends BaseComponent<WmPartialProps, WmPartialState, WmPartialStyles> {

  constructor(props: WmPartialProps) {
    super(props, DEFAULT_CLASS, );
  }

  public renderSkeleton(props: WmPartialProps): React.ReactNode {
    const lottieContentStyles = this.styles?.skeleton as any as WmSkeletonStyles
    if(this.props.skeletonanimationresource) {
      return <View style={[{width: '100%'}, this.styles.root]}>
        <WmLottie styles={{ content: lottieContentStyles.root}} source={this.props.skeletonanimationresource} loop={true} autoplay={true} speed={this.props.skeletonanimationspeed}/>
      </View>
    }
    return null;
  }

  renderWidget(props: WmPartialProps) {
    return (
      <View style={this.styles.root}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
