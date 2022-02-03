import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { BaseNavProps } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.props';
import { BaseNavComponent, BaseNavState, NavigationDataItem } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component';

import WmTabbarProps from './tabbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTabbarStyles } from './tabbar.styles';

class WmTabbarState<T extends BaseNavProps> extends BaseNavState<T>{
  showMore = false;
  modalOptions = {} as ModalOptions;
}

export default class WmTabbar extends BaseNavComponent<WmTabbarProps, WmTabbarState<WmTabbarProps>, WmTabbarStyles> {

  private tabbarHeight = 0;

  constructor(props: WmTabbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabbarProps(), new WmTabbarState());
  }

  renderTabItem(item: NavigationDataItem, props: WmTabbarProps, onSelect: Function) {
    const isActive = props.isActive && props.isActive(item);
    return (
      <TouchableOpacity onPress={() => onSelect && onSelect()}  key={item.key}>
        <View style={[this.styles.tabItem, isActive ? this.styles.activeTabItem: {}]}>
            <WmIcon styles={this.theme.mergeStyle({}, this.styles.tabIcon, isActive ? this.styles.activeTabIcon: {})} iconclass={item.icon}></WmIcon>
            <Text style={[this.styles.tabLabel, isActive ? this.styles.activeTabLabel: {}]}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  onItemSelect(item: NavigationDataItem, navigationService: NavigationService) {
    item.link && navigationService.openUrl(item.link);
    this.invokeEventCallback('onSelect', [null, this.proxy, item]);
  }

  prepareModalOptions(content: ReactNode) {
    const o = this.state.modalOptions;
    o.content = content;
    o.modalStyle = {
      bottom: this.tabbarHeight
    };
    o.contentStyle = this.styles.modalContent; 
    return o;
  }

  renderWidget(props: WmTabbarProps) {
    let max = 5;
    const tabItems = this.state.dataItems;
    const moreItems = [] as any[][];
    if (tabItems.length > max) {
      const moreItemsCount = Math.ceil((tabItems.length + 1 - max)/ max) * max;
      let j = 0;
      for (let i = max-1; i < moreItemsCount;) {
        const row = [];
        for (let j = 0; j < max; j++) {
          row[j] = tabItems[i++] || {key: 'tabItem' + i} as NavigationDataItem;
        }
        moreItems.push(row);
      }
      max = max - 1;
    }
    return (
      <NavigationServiceConsumer>
        {(navigationService) =>
        (<View style={this.styles.root}>
          <ModalConsumer>
            {(modalService: ModalService) => {
              if (this.state.showMore) {
                modalService.showModal(this.prepareModalOptions((
                <ThemeProvider value={this.theme} >
                  <View style={this.styles.moreMenu}>
                    {moreItems.map((a, i) =>
                      (<View key={i} style={this.styles.moreMenuRow}>
                        {a.map(item => this.renderTabItem(item, props,  () => this.onItemSelect(item, navigationService)))}
                      </View>)
                    )}
                  </View>
                </ThemeProvider>)));
              } else {
                modalService.hideModal(this.state.modalOptions);
              }
              return null;
            }}
          </ModalConsumer>
          <View style={this.styles.menu}
            onLayout={e => { this.tabbarHeight = e.nativeEvent.layout.height}}>
            {tabItems.filter((item, i) => i < max)
              .map((item, i) => this.renderTabItem(item, props, () => this.onItemSelect(item, navigationService)))}
            {tabItems.length > max && (
              this.renderTabItem({
                label: props.morebuttonlabel,
                icon: props.morebuttoniconclass
              } as NavigationDataItem, props,  () => {
                this.updateState({showMore: !this.state.showMore} as WmTabbarState<WmTabbarProps>);
              })
            )}
          </View>
        </View>)}
      </NavigationServiceConsumer>
    );
  }
}
