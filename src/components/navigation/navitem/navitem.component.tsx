import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmNavItemProps from './navitem.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmNavItemStyles } from './navitem.styles';

export class WmNavItemState extends BaseComponentState<WmNavItemProps> {
  collapsed = true;
}

export default class WmNavItem extends BaseComponent<WmNavItemProps, WmNavItemState, WmNavItemStyles> {

  constructor(props: WmNavItemProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavItemProps(), new WmNavItemState());
  }

  renderWidget(props: WmNavItemProps) {
    let child = props.children;
    if (props.view === 'anchor') {
      child = <WmAnchor styles={this.styles.navAnchorItem} caption={props.item.label} hyperlink={props.item.link} badgevalue={props.item.badge} iconclass={props.item.icon}></WmAnchor>
    }
    if (props.view === 'dropdown') {
      child = (
        <>
        <TouchableOpacity onPress={() => {
          this.updateState({collapsed: !this.state.collapsed} as WmNavItemState);
        }}>
          <View style={this.styles.dropdownNav}>
            <WmAnchor styles={this.styles.navAnchorItem} caption={props.item.label} iconclass={props.item.icon}></WmAnchor>
            <WmIcon styles={this.styles.caretIcon} iconclass={this.state.collapsed ? 'fa fa-sort-down' : 'fa fa-sort-up'}></WmIcon>
          </View>
        </TouchableOpacity>
        {!this.state.collapsed && props.children}
        </>
      );
    }
    return (
      <View style={this.styles.root}>{child}</View>
    );
  }
}
