import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLinearlayoutProps from './linearlayout.props';
import { DEFAULT_CLASS, WmLinearlayoutStyles } from './linearlayout.styles';

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

  renderWidget(props: WmLinearlayoutProps) {
    return (<View style={{...this.getStyles(props), ...this.styles.root}}>
      {this._background}{props.children}
      </View>); 
  }
}
