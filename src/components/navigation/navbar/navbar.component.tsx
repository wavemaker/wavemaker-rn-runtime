import React from 'react';
import { View } from 'react-native';
import { Drawer } from 'react-native-paper';

import WmNavItem from '@wavemaker/app-rn-runtime/components/navigation/navitem/navitem.component';
import { BaseNavComponent, NavigationDataItem, BaseNavState } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component';
import { BaseNavProps } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.props';
import WmNavbarProps from './navbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmNavbarStyles } from './navbar.styles';

class WmNavbarState<T extends BaseNavProps> extends BaseNavState<T> {}

export default class WmNavbar extends BaseNavComponent<WmNavbarProps, WmNavbarState<WmNavbarProps>, WmNavbarStyles> {
  constructor(props: WmNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavbarProps(), new WmNavbarState());
  }

  renderNavItem(item: NavigationDataItem, props: WmNavbarProps) {
    return (
      <View style={this.styles.navitem} key={item.key} >
        <WmNavItem item={item} defaultview={false}></WmNavItem>
      </View>
    );
  }

  renderWidget(props: WmNavbarProps) {
    const navItems = this.state.dataItems;
    let childElements = props.children;
    const styleName = props.layout + 'Nav';

    return (
      <Drawer.Section style={[this.theme.getStyle(styleName), this.styles.nav]}>
        { navItems && navItems.length ? navItems.map(item => this.renderNavItem(item, props)) : childElements}
      </Drawer.Section>
    );
  }
}
