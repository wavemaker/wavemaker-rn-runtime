import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmGridcolumnProps from './gridcolumn.props';
import { DEFAULT_CLASS, WmGridColumnStyles } from './gridcolumn.styles';

export class WmGridcolumnState extends BaseComponentState<WmGridcolumnProps> {

}

export default class WmGridcolumn extends BaseComponent<WmGridcolumnProps, WmGridcolumnState, WmGridColumnStyles> {

  constructor(props: WmGridcolumnProps) {
    super(props, DEFAULT_CLASS, new WmGridcolumnProps());
  }

  renderWidget(props: WmGridcolumnProps) {
    if (this.styles.root.height) {
      this.styles.root.overflow = undefined;
    }
    const styles = this.theme.getStyle(`col-xs-${props.xscolumnwidth}  col-sm-${props.columnwidth}`);
    return (
      <View style={[{width: "100%"}, styles.root, this.styles.root]}>{props.children}</View>
    );
  }
}
