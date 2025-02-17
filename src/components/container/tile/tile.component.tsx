import React from 'react';
import { LayoutChangeEvent, View } from 'react-native'
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTileProps from './tile.props';
import { DEFAULT_CLASS, WmTileStyles } from './tile.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmTileState extends BaseComponentState<WmTileProps> {}

export default class WmTile extends BaseComponent<WmTileProps, WmTileState, WmTileStyles> {

  constructor(props: WmTileProps) {
    super(props, DEFAULT_CLASS, new WmTileProps());
  }
    
  public renderSkeleton(props: WmTileProps): React.ReactNode {
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

  getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  } 
  
  renderWidget(props: WmTileProps) {
    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
     } : this.styles.root;
     
    return (
    <Tappable 
      {...this.getTestPropsForAction()} 
      target={this} 
      disableTouchEffect={this.state.props.disabletoucheffect}
      onLayout={(event: LayoutChangeEvent) => this.handleLayout(event)}
    >
      <Animatedview entryanimation={props.animation} delay={props.animationdelay} style={styles}>{this.getBackground()}{props.children}</Animatedview>
    </Tappable>);
  }
}

