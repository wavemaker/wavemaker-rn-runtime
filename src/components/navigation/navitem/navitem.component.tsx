import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmNavItemProps from './navitem.props';
import { DEFAULT_CLASS, WmNavItemStyles } from './navitem.styles';
import { NavigationDataItem } from "@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component";
import { TapEvent } from "@wavemaker/app-rn-runtime/core/tappable.component";

export class WmNavItemState extends BaseComponentState<WmNavItemProps> {
  collapsed = true;
}

export default class WmNavItem extends BaseComponent<WmNavItemProps, WmNavItemState, WmNavItemStyles> {

  constructor(props: WmNavItemProps) {
    super(props, DEFAULT_CLASS, new WmNavItemProps(), new WmNavItemState());
  }

  onSelectItem(cb: any, $item: NavigationDataItem, $event: TapEvent) {
    cb && cb($event, this, $item);
  }

  renderWidget(props: WmNavItemProps) {
    let child = props.children;
    if (props.view === 'anchor') {
      child = <WmAnchor styles={this.styles.navAnchorItem} caption={props.item.label} hyperlink={props.item.link}
                 badgevalue={props.item.badge} iconclass={props.item.icon} onTap={this.onSelectItem.bind(this, props.onSelect, props.item)}></WmAnchor>
    }
    if (props.view === 'dropdown') {
      child = (
        <>
        <TouchableOpacity onPress={() => {
          this.updateState({collapsed: !this.state.collapsed} as WmNavItemState);
        }}>
          <View style={this.styles.dropdownNav}>
            <WmAnchor styles={this.styles.navAnchorItem} caption={props.item.label} iconclass={props.item.icon} onTap={this.onSelectItem.bind(this, props.onSelect, props.item)}></WmAnchor>
            <WmIcon styles={this.styles.caretIcon} iconclass={this.state.collapsed ? 'fa fa-sort-down' : 'fa fa-sort-up'}></WmIcon>
          </View>
        </TouchableOpacity>
        {!this.state.collapsed && props.children}
        </>
      );
    }
    return (
      <View style={this.styles.root}>{this._background}{child}</View>
    );
  }
}
