import React from 'react';
import { View } from 'react-native';

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

  computeItemStyles(props: WmNavbarProps) {
    let activeItemStyles = this.theme.getStyle('app-navitem-active');
    let itemStyles = this.theme.getStyle('app-navitem');
    const indentStyle =  props.indent ? {
      navAnchorItem: {
        root: {
          paddingLeft: props.indent
        }
      }
    } :  null;
    if (props.ischildnav) {
      itemStyles = this.theme.mergeStyle({}, itemStyles, this.theme.getStyle('app-navitem-child'));
    }
    activeItemStyles = this.theme.mergeStyle({}, activeItemStyles, indentStyle);
    itemStyles = this.theme.mergeStyle({}, itemStyles, indentStyle);
    return {activeItemStyles, itemStyles};
  }

  renderNavItem(item: NavigationDataItem, props: WmNavbarProps) {
    const indent = this.styles.childNav.paddingLeft as number || 0;
    const {activeItemStyles, itemStyles} = this.computeItemStyles(props);
    return (
      <View style={this.styles.navitem} key={item.key} >
        <WmNavItem item={item}
          onSelect={props.onSelect}
          styles={item.isactive ? activeItemStyles: itemStyles}
          view={item.childnavigation ? 'dropdown' : 'anchor'}>
          {item.childnavigation && (
            <WmNavbar
              dataset={item.childnavigation}
              type={props.type}
              styles={this.styles}
              layout={props.layout}
              itemlabel={props.itemlabel}
              itembadge={props.itembadge}
              itemicon={props.itemicon}
              itemchildren={props.itemchildren}
              itemlink={props.itemlink}
              isactive={props.isactive}
              indent={props.indent || indent + indent}
              ischildnav={true}>
            </WmNavbar>)}
        </WmNavItem>
      </View>
    );
  }

  renderWidget(props: WmNavbarProps) {
    const navItems = this.state.dataItems;
    let childElements = props.children;
    const styleName = props.layout + 'Nav';

    return (
      <View style={[this.theme.getStyle(styleName), this.styles.nav]}>
          { navItems && navItems.length ? navItems.map(item => {
              return this.renderNavItem(item, props);
            }) : childElements
          }
      </View>
    );
  }
}
