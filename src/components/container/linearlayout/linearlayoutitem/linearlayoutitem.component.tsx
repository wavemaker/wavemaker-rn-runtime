import React from 'react';
import { View } from 'react-native';
import { isNil } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLinearlayoutitemProps from './linearlayoutitem.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLinearlayoutitemStyles } from './linearlayoutitem.styles';

export class WmLinearlayoutitemState extends BaseComponentState<WmLinearlayoutitemProps> {}

export default class WmLinearlayoutitem extends BaseComponent<WmLinearlayoutitemProps, WmLinearlayoutitemState, WmLinearlayoutitemStyles> {

  constructor(props: WmLinearlayoutitemProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLinearlayoutitemProps());
  }

  renderWidget(props: WmLinearlayoutitemProps) {
    return (<View style={{
      ...this.styles.root,
      flexGrow: props.flexgrow,
      flexShrink: isNil(props.flexshrink) ? props.flexgrow : props.flexshrink
    }}>{props.children}</View>); 
  }
}