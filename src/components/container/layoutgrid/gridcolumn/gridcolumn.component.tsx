import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmGridcolumnProps from './gridcolumn.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './gridcolumn.styles';

export default class WmGridcolumn extends BaseComponent<WmGridcolumnProps, BaseComponentState<WmGridcolumnProps>> {

  constructor(props: WmGridcolumnProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmGridcolumnProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    if (this.styles.root.height) {
      this.styles.root.overflow = 'auto';
    }
    return props.show ? (
      <View style={[this.styles.root, {flex: props.xscolumnwidth || props.columnwidth}]}>{props.children}</View>
    ): null;
  }
}
