import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmGridcolumnProps from './gridcolumn.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmGridColumnStyles } from './gridcolumn.styles';

export class WmGridcolumnState extends BaseComponentState<WmGridcolumnProps> {

}

export default class WmGridcolumn extends BaseComponent<WmGridcolumnProps, WmGridcolumnState, WmGridColumnStyles> {

  constructor(props: WmGridcolumnProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmGridcolumnProps());
  }

  renderWidget(props: WmGridcolumnProps) {
    if (this.styles.root.height) {
      this.styles.root.overflow = undefined;
    }
    return (
      <View style={[this.styles.root, {flex: props.xscolumnwidth || props.columnwidth}]}>{props.children}</View>
    );
  }
}
