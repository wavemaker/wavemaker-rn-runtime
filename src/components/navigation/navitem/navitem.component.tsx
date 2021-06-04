import React from 'react';
import { View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmNavItemProps from './navitem.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './navitem.styles';

export default class WmNavItem extends BaseComponent<WmNavItemProps, BaseComponentState<WmNavItemProps>> {

  constructor(props: WmNavItemProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavItemProps());
  }

  render() {
    super.render();
    const props = this.state.props;

    return props.show ? (
      <View style={this.styles.nav}>{props.children}</View>
    ): null;
  }
}
