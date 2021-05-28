import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmTabbarProps from './tabbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './tabbar.styles';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';

interface TabItem {
  key: string;
  label: string;
  icon: string;
  link: string;
}

class WmTabbarState extends BaseComponentState<WmTabbarProps>{
  tabItems = [] as TabItem[];
  showMore = false;
  modalOptions = {} as ModalOptions;
}

export default class WmTabbar extends BaseComponent<WmTabbarProps, WmTabbarState> {
  
  private tabbarHeight = 0;

  constructor(props: WmTabbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabbarProps(), new WmTabbarState());
  }

  setTabItems(dataset: any = this.state.props.dataset) {
    const name = this.props.name;
    let tabItems = [] as TabItem[];
    if (typeof dataset === 'string') {
      tabItems = dataset.split(',').map((s, i) => {
        return {
          key: `${name}_tabitem${i}`,
          label: s,
          icon: 'wi wi-' + s
        } as TabItem;
      });
    } else if(dataset) {
      tabItems = (dataset as any[]).map((d, i) => {
        return {
          key: `${name}_tabitem${i}`,
          label: d[this.state.props.itemlabel],
          icon: d[this.state.props.itemicon],
          link: d[this.state.props.itemlink]
        }
      });
    }
    this.updateState('tabItems', tabItems);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'dataset':
        this.setTabItems($new);
        break;
      case 'itemlabel':
      case 'itemlabel':
      case 'itemlink':
        this.setTabItems();
        break;
    }
  }

  renderTabItem(item: TabItem, props: WmTabbarProps, onSelect: Function) {
    return (
      <View style={this.styles.tabItem} key={item.key} >
        <TouchableOpacity onPress={() => onSelect && onSelect()}>
          <WmIcon name="" styles={this.styles.tabIcon} themeToUse={props.themeToUse} iconclass={item.icon}></WmIcon>
          <Text style={this.styles.tabLabel}>{item.label}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onItemSelect(item: TabItem, navigationService: NavigationService) {
    item.link && navigationService.openUrl(item.link);
    this.invokeEventCallback('onSelect', [null, this.proxy, item]);
  }

  prepareModalOptions(content: ReactNode) {
    const o = this.state.modalOptions;
    o.content = content;
    o.modalStyle = {
      top: 'auto',
      height: 'auto',
      bottom: this.tabbarHeight
    };
    o.contentStyle = this.styles.modalContent;
    return o;
  }

  render() {
    super.render();
    let max = 4;
    const props = this.state.props;
    const tabItems = this.state.tabItems;
    const moreItems = [] as any[][];
    if (tabItems.length > max) {
      const moreItemsCount = Math.ceil((tabItems.length + 1 - max)/ max) * max;
      let j = 0;
      for (let i = max-1; i < moreItemsCount;) {
        const row = [];
        for (let j = 0; j < max; j++) {
          row[j] = tabItems[i++] || {} as TabItem;
        }
        moreItems.push(row);
      }
      max = max - 1;
    }
    return props.show ? (
      <NavigationServiceConsumer>
        {(navigationService) => 
        (<View style={this.styles.root}>
          <ModalConsumer>
            {(modalService: ModalService) => {
              if (this.state.showMore) {
                modalService.showModal(this.prepareModalOptions((
                <View style={this.styles.moreMenu}>
                  {moreItems.map((a, i) =>  
                    (<View style={this.styles.moreMenuRow}>
                      {a.map(item => this.renderTabItem(item, props,  () => this.onItemSelect(item, navigationService)))}
                    </View>)
                  )}
                </View>)));
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
              } as TabItem, props,  () => {
                this.updateState('showMore', !this.state.showMore);
                this.forceUpdate();
              })
            )}
          </View>
        </View>)}
      </NavigationServiceConsumer>
    ): null;
  }
}
