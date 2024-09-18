import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLinearlayoutProps from './linearlayout.props';
import { DEFAULT_CLASS, WmLinearlayoutStyles } from './linearlayout.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

const ALIGNMENT_MAP = {
  'top':  'flex-start',
  'left': 'flex-start',
  'center': 'center',
  'right': 'flex-end',
  'bottom': 'flex-end'
} as any;

export class WmLinearlayoutState extends BaseComponentState<WmLinearlayoutProps> {}

export default class WmLinearlayout extends BaseComponent<WmLinearlayoutProps, WmLinearlayoutState, WmLinearlayoutStyles> {

  constructor(props: WmLinearlayoutProps) {
    super(props, DEFAULT_CLASS, new WmLinearlayoutProps());
  }

  getStyles(props: WmLinearlayoutProps) {
    const s = {} as ViewStyle;
    const direction = props.direction;
    s.display = 'flex';
    s.width = "100%";
    s.flexDirection = direction;
    const isHorizontal = direction.startsWith('row');
    if (isHorizontal) {
      s.justifyContent = ALIGNMENT_MAP[props.horizontalalign];
      s.alignItems = ALIGNMENT_MAP[props.verticalalign];
    } else {
      s.justifyContent = ALIGNMENT_MAP[props.verticalalign];
      s.alignItems = ALIGNMENT_MAP[props.horizontalalign];
    }
    return s;
  }

  protected getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  } 
  
  public renderSkeleton(props: WmLinearlayoutProps): React.ReactNode {
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


  renderWidget(props: WmLinearlayoutProps) {

    const rootStyles = {...this.getStyles(props), ...this.styles.root}
    const styles = this._showSkeleton ? {
      ...rootStyles,
      ...this.styles.skeleton.root
    } : rootStyles

    return (<View style={styles}>
      {this.getBackground()}{props.children}
      </View>); 
  }
}
