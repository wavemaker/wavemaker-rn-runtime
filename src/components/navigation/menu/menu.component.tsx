import React from 'react';
import { View } from 'react-native';

import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import { LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';

import { BaseNavComponent, BaseNavState, NavigationDataItem } from '../basenav/basenav.component';
import WmPopover from '../popover/popover.component';
import WmMenuProps from './menu.props';
import { DEFAULT_CLASS, WmMenuStyles } from './menu.styles';

export class WmMenuState <T extends WmMenuProps> extends BaseNavState<T> {}

const animationMap: any = {
  slide: 'slideInDown',
  fade: 'fadeIn',
  scale: 'zoomIn'
};

export default class WmMenu extends BaseNavComponent<WmMenuProps, WmMenuState<WmMenuProps>, WmMenuStyles> {

  private popOverRef: WmPopover = null as any;

  private listener: LifecycleListener = {
    onComponentInit: (c) => {
      if (c instanceof WmPopover) {
        this.popOverRef = c;
      }
    }
  };

  constructor(props: WmMenuProps) {
    super(props, DEFAULT_CLASS, new WmMenuProps(), new WmMenuState());
  }

  renderMenuItem(item: NavigationDataItem) {
    const getDisplayLabel = this.props.getDisplayExpression || ((label: string) => label);
    return (
      <WmAnchor
        iconclass={item.icon as string}
        caption={getDisplayLabel(item.label)}
        hyperlink={item.link}
        styles={this.styles.menuItem}
        onTap={() => {
          this.invokeEventCallback('onSelect', [null, this, item]);
          this.popOverRef.hide();
      }}></WmAnchor>
    );
  }

  renderWidget(props: WmMenuProps) {
    const menuItems = this.state.dataItems;
    return (
      <WmPopover styles={this.styles}
        contentanimation={animationMap[props.animateitems || 'scale']}
        caption={props.caption}
        iconclass={props.iconclass}
        listener={this.listener}
        popoverheight={this.styles.menu.height as string | number | undefined || null}
        popoverwidth={this.styles.menu.width as string | number | undefined || null}
        iconposition="right"
        type='dropdown'>
          <View style={this.styles.menu}>
            {menuItems.map(item => (
              <View key={item.key}>
                {this.renderMenuItem(item)}
              </View>
            ))}
          </View>
      </WmPopover>
    );
  }
}
