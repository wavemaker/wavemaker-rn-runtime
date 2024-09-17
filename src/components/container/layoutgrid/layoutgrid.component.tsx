import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLayoutgridProps from './layoutgrid.props';
import { DEFAULT_CLASS, WmLayoutGridStyles } from './layoutgrid.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmLayoutgridState extends BaseComponentState<WmLayoutgridProps> {

}

export default class WmLayoutgrid extends BaseComponent<WmLayoutgridProps, WmLayoutgridState, WmLayoutGridStyles> {

  constructor(props: WmLayoutgridProps) {
    super(props, DEFAULT_CLASS, new WmLayoutgridProps());
  }

  getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  } 

  public renderSkeleton(props: WmLayoutgridProps): React.ReactNode {
    if(!props.showskeletonchildren) {
      const skeletonStyles: WmSkeletonStyles = this.props?.styles?.skeleton || { root: {}, text: {}  } as WmSkeletonStyles
      return createSkeleton(this.theme, skeletonStyles, {
        ...this.styles.root
      }, (<View style={[this.styles.root, { opacity: 0 }]}>
        {props.children}
      </View>))
    }
    return null;
  }


  renderWidget(props: WmLayoutgridProps) {
    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root
    return (
      <View style={styles}>{this.getBackground()}{props.children}</View>
    ); 
  }
}
