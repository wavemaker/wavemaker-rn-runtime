import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTileProps from './tile.props';
import { DEFAULT_CLASS, WmTileStyles } from './tile.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { createSkeleton } from '../../basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';
import { Alert, ViewStyle } from 'react-native';

import { View } from 'react-native'

export class WmTileState extends BaseComponentState<WmTileProps> {}

export default class WmTile extends BaseComponent<WmTileProps, WmTileState, WmTileStyles> {

  constructor(props: WmTileProps) {
    super(props, DEFAULT_CLASS, new WmTileProps());
  }
  
  public renderSkeleton(props: WmTileProps): React.ReactNode | null {
    if(!props.showskeletonchildren) {
      return createSkeleton(this.theme, this.styles.skeleton, {
       ...this.styles.root,
      }, (<View style={[this.styles.root, {opacity: 0}]}>
        {props.children}
      </View>))
    }
    return null
  }

  renderWidget(props: WmTileProps) {
    const style: ViewStyle = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    }  : this.styles.root

    return (<Tappable {...this.getTestPropsForAction()} target={this}>
      <Animatedview entryanimation={props.animation} delay={props.animationdelay}  style={style}>{!this._showSkeleton ? this._background : null}{props.children}</Animatedview>
    </Tappable>);
  }
}

