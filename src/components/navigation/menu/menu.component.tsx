import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';

import { BaseNavComponent, BaseNavState, NavigationDataItem } from '../basenav/basenav.component';
import WmMenuProps from './menu.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmMenuStyles } from './menu.styles';
import NavigationService, { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';

export class WmMenuState <T extends WmMenuProps> extends BaseNavState<T> {
  isOpened: boolean = false;
  modalOptions = {} as ModalOptions;
  menuPosition = {} as MenuPosition;
}

export interface MenuPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export default class WmMenu extends BaseNavComponent<WmMenuProps, WmMenuState<WmMenuProps>, WmMenuStyles> {

  private _close: Function = () => {};

  constructor(props: WmMenuProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmMenuProps(), new WmMenuState());
  }

  private computePosition = (e: LayoutChangeEvent) => {
    const position = {} as MenuPosition;
    const layout = e.nativeEvent.layout;
    position.left = layout.x + layout.width - (this.styles.menu.width as number || 0);
    position.top = layout.y + layout.height;
    this.updateState({menuPosition: position} as WmMenuState<any>);
  };

  private openMenu = () => this.setState({ isOpened: true });

  private closeMenu = () => this.setState({ isOpened: false });

  prepareModalOptions(content: React.ReactNode, modalService: ModalService) {
    const o = this.state.modalOptions;
    o.modalStyle = this.styles.modal;
    o.contentStyle = {...this.styles.modalContent, ...this.state.menuPosition};
    o.content = content;
    o.isModal = true;
    o.centered = true;
    o.onClose = this.closeMenu;
    this._close = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  renderMenuItem(item: NavigationDataItem) {
    return (
      <WmAnchor
        iconclass={item.icon as string}
        caption={item.label}
        hyperlink={item.link}
        styles={this.styles.menuItem} onTap={() => {
        this.invokeEventCallback('onSelect', [null, this, item]);
        this._close();
      }}></WmAnchor>
    );
  }

  renderWidget(props: WmMenuProps) {
    const menuItems = this.state.dataItems;
    return (
      <View style={this.styles.root} onLayout={this.computePosition}>
        <NavigationServiceConsumer>
          {(navigationService: NavigationService) => (
            <Tappable target={this} onTap={this.openMenu}>
              <WmIcon caption={props.caption} iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>
              {this.state.isOpened && (
                <ModalConsumer>
                  {(modalService: ModalService) => {
                    modalService.showModal(this.prepareModalOptions((
                      <NavigationServiceProvider value={navigationService}>
                        <View style={this.styles.menu}>
                          {menuItems.map((item, i) => (
                            <View key={item.key}>{this.renderMenuItem(item)}</View>
                          ))}
                        </View>
                      </NavigationServiceProvider>
                    ), modalService));
                    return null;
                  }}
                </ModalConsumer>)}
            </Tappable>
          )}
        </NavigationServiceConsumer>
      </View>);
  }
}
