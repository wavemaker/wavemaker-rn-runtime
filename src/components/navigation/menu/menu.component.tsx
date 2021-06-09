import React from 'react';
import { View } from 'react-native';
import { Menu, Button, Provider } from 'react-native-paper';

import { BaseNavComponent, BaseNavState, NavigationDataItem } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component';
import WmMenuProps from './menu.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmMenuStyles } from './menu.styles';

export class WmMenuState <T extends WmMenuProps> extends BaseNavState<T> {
  visible: boolean = false;
}

export default class WmMenu extends BaseNavComponent<WmMenuProps, WmMenuState<WmMenuProps>, WmMenuStyles> {

  constructor(props: WmMenuProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmMenuProps());
  }

  private openMenu = () => this.setState({ visible: true });

  private closeMenu = () => this.setState({ visible: false });

  renderTabItem(item: NavigationDataItem) {
    return (
      <Menu.Item onPress={() => {}} key={item.key} title={item.label} />
    );
  }

  renderWidget(props: WmMenuProps) {
    const menuItems = this.state.dataItems;
    return (
      <Provider>
        <View>
          <Menu style={this.styles.root}
                visible={this.state.visible}
                onDismiss={this.closeMenu}
                anchor={<Button onPress={this.openMenu}>{props.caption}</Button>}>
            {menuItems && menuItems.length ?
              menuItems.map(item => this.renderTabItem(item)): null}
          </Menu>
        </View>
      </Provider>);
  }
}
