import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabbarProps from './tabbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './tabbar.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface TabItem {
  label: string;
  icon: string;
}

class WmTabbarState extends BaseComponentState<WmTabbarProps>{
  tabItems = [] as TabItem[];
  showMore = false;
}

export default class WmTabbar extends BaseComponent<WmTabbarProps, WmTabbarState> {

  constructor(props: WmTabbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabbarProps(), new WmTabbarState());
  }

  setTabItems(dataset: any) {
    let tabItems = [] as TabItem[];
    if (typeof dataset === 'string') {
      tabItems = dataset.split(',').map(s => {
        return {
          label: s,
          icon: 'wi wi-' + s
        }
      });
    } else {
      tabItems = dataset;
    }
    this.updateState('tabItems', tabItems);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'dataset':
        this.setTabItems($new);
        break;
    }
  }

  renderTabItem(item: TabItem, props: WmTabbarProps, onSelect: Function) {
    return (
      <View style={this.styles.tabItem} key={item.label} >
        <TouchableOpacity onPress={() => onSelect && onSelect()}>
          <WmIcon name="" styles={this.styles.tabIcon} themeToUse={props.themeToUse} iconclass={item.icon}></WmIcon>
          <Text style={this.styles.tabLabel}>{item.label}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onItemSelect() {

  }

  render() {
    super.render();
    const max = 3;
    const props = this.state.props;
    const tabItems = this.state.tabItems;
    return props.show ? (
    <View style={this.styles.root}>
      <View style={this.styles.menu}>
        {tabItems.map((item, i) => {
          return i > max ? null : this.renderTabItem(item, props, () => this.onItemSelect());
        })}
        {tabItems.length > max && (
          this.renderTabItem({
            label: 'more',
            icon: 'wi wi-more'
          }, props,  () => this.updateState('showMore', !this.state.showMore))
        )}
      </View>
      {this.state.showMore && (<View style={this.styles.extras}>
        {tabItems.map((item, i) => {
          return i > max ? this.renderTabItem(item, props,  () => this.onItemSelect()) : null;
        })}
      </View>)}
    </View>
    ): null; 
  }
}
