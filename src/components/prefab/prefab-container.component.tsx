import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPrefabContainerProps from './prefab-container.props';
import { DEFAULT_CLASS, WmPrefabContainerStyles } from './prefab-container.styles';
import WmLottie from '../basic/lottie/lottie.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';

export class WmPrefabContainerState extends BaseComponentState<WmPrefabContainerProps> {

}


export default class WmPrefabContainer extends BaseComponent<WmPrefabContainerProps, WmPrefabContainerState, WmPrefabContainerStyles> {

  constructor(props: WmPrefabContainerProps) {
    super(props, DEFAULT_CLASS, );
  }

  public renderSkeleton(props: WmPrefabContainerProps): React.ReactNode {
    const lottieContentStyles = this.styles?.skeleton as any as WmSkeletonStyles
    if(this.props.skeletonanimationresource) {
      return <View style={[{width: '100%'}, this.styles?.root]}>
        <WmLottie styles={{ content: lottieContentStyles.root}} source={this.props.skeletonanimationresource} loop={true} autoplay={true} speed={this.props.skeletonanimationspeed}/>
        </View>
    }
    return null;
  }

  renderWidget(props: WmPrefabContainerProps) {
    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root
    return (
      <View style={styles}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
