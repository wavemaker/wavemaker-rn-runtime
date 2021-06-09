import React from 'react';
import { Drawer } from 'react-native-paper';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmNavbarProps from './navbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmNavbarStyles } from './navbar.styles';


export class WmNavbarState extends BaseComponentState<WmNavbarProps> {

}

export default class WmNavbar extends BaseComponent<WmNavbarProps, WmNavbarState, WmNavbarStyles> {

  constructor(props: WmNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavbarProps());
  }

  renderWidget(props: WmNavbarProps) {
    return (
      <Drawer.Section style={this.styles.nav}>
        {props.children}
      </Drawer.Section>
    );
  }
}
