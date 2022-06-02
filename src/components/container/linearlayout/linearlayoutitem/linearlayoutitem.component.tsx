import React from 'react';
import { View } from 'react-native';
import { isNil } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLinearlayout from '../linearlayout.component';
import WmLinearlayoutitemProps from './linearlayoutitem.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLinearlayoutitemStyles } from './linearlayoutitem.styles';

export class WmLinearlayoutitemState extends BaseComponentState<WmLinearlayoutitemProps> {}

export default class WmLinearlayoutitem extends BaseComponent<WmLinearlayoutitemProps, WmLinearlayoutitemState, WmLinearlayoutitemStyles> {

  constructor(props: WmLinearlayoutitemProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLinearlayoutitemProps());
  }

  renderWidget(props: WmLinearlayoutitemProps) {
    const direction = (this.parent as WmLinearlayout).state.props.direction;
    return (<View style={{
      ...this.styles.root,
      flexGrow: props.flexgrow,
      flexShrink: isNil(props.flexshrink) ? props.flexgrow : props.flexshrink,
      flexBasis:  props.flexgrow && (direction === 'row' || direction === 'row-reverse') ? 0 : 'auto'
    }}>{props.children}</View>); 
  }
}