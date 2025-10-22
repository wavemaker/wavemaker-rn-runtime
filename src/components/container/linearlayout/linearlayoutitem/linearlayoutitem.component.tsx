import React from 'react';
import { View, Platform } from 'react-native';
import { isNil } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLinearlayout from '../linearlayout.component';
import WmLinearlayoutitemProps from './linearlayoutitem.props';
import { DEFAULT_CLASS, WmLinearlayoutitemStyles } from './linearlayoutitem.styles';

export class WmLinearlayoutitemState extends BaseComponentState<WmLinearlayoutitemProps> {}

export default class WmLinearlayoutitem extends BaseComponent<WmLinearlayoutitemProps, WmLinearlayoutitemState, WmLinearlayoutitemStyles> {

  constructor(props: WmLinearlayoutitemProps) {
    super(props, DEFAULT_CLASS, new WmLinearlayoutitemProps());
  }

  renderWidget(props: WmLinearlayoutitemProps) {
    const direction = (this.parent as WmLinearlayout).state.props.direction;
    return (
    <View 
      style={{
        ...this.styles.root,
        flexGrow: props.flexgrow,
        flexShrink: isNil(props.flexshrink) ? Platform.OS == "web" ? props.flexgrow : 0 : props.flexshrink,
        flexBasis:  (props.flexgrow && (direction === 'row' || direction === 'row-reverse') && Platform.OS !== 'android' ? 0 : 'auto')   
      } as any}
      onLayout={(event) => this.handleLayout(event)}
    >{this._background}{props.children}</View>); 

  }
}