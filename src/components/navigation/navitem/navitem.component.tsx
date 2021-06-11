import React from 'react';
import { View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';

import WmNavItemProps from './navitem.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmNavItemStyles } from './navitem.styles';

export class WmNavItemState extends BaseComponentState<WmNavItemProps> {}

export default class WmNavItem extends BaseComponent<WmNavItemProps, WmNavItemState, WmNavItemStyles> {

  constructor(props: WmNavItemProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavItemProps());
  }

  renderWidget(props: WmNavItemProps) {
    let child = props.children;
    if (!props.defaultview) {
      child = <WmAnchor styles={this.theme.getStyle('navAnchorItem')} caption={props.item.label} hyperlink={props.item.link} badgevalue={props.item.badge} iconclass={props.item.icon}></WmAnchor>
    }

    return (
      <View style={this.styles.nav}>{child}</View>
    );
  }
}
