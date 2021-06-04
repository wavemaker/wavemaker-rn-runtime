import React from 'react';
import {Text, View} from 'react-native';
import { Drawer } from 'react-native-paper';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmNavbarProps from './navbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './navbar.styles';
import WmTabbarProps from "@wavemaker/app-rn-runtime/components/page/tabbar/tabbar.props";
import {TouchableOpacity} from "react-native-gesture-handler";
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";

interface NavItem {
  key: string;
  label: string;
  icon: string;
  link: string;
}

export default class WmNavbar extends BaseComponent<WmNavbarProps, BaseComponentState<WmNavbarProps>> {

  constructor(props: WmNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavbarProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Drawer.Section style={this.styles.nav}>
        {props.children}
      </Drawer.Section>
    ): null;
  }
}
