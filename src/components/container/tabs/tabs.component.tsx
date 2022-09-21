import React from 'react';
import { View } from 'react-native';
import { isArray } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { isDefined } from '@wavemaker/app-rn-runtime/core/utils';

import WmTabsProps from './tabs.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTabsStyles } from './tabs.styles';
import {
  Tabs,
  TabScreen,
  } from 'react-native-paper-tabs';
import WmTabpane from './tabpane/tabpane.component';

export class WmTabsState extends BaseComponentState<WmTabsProps> {
  selectedTabIndex: number = 0;
}

export default class WmTabs extends BaseComponent<WmTabsProps, WmTabsState, WmTabsStyles> {
  public tabPanes = [] as WmTabpane[];
  private newIndex = 0;
  constructor(props: WmTabsProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabsProps());
    this.updateState({
      selectedTabIndex: props.defaultpaneindex || 0
    }as WmTabsState);
  }

  addTabPane(tabPane: WmTabpane) {
    this.tabPanes[this.newIndex || this.state.selectedTabIndex] = tabPane;
    this.newIndex++;
  }

  renderTabpane(item: any, index: any) {
    return(
      <TabScreen label={(item.props.title !== null && isDefined(item.props.title)) ? item.props.title : 'Tab Title'} key={'tabpane_' + index} icon={item.props.paneicon}>
        <View style={{flex: 1}}>{item}</View>
      </TabScreen>)
  }

  onChange(newIndex: any) {
    const oldIndex = this.state.selectedTabIndex;
    const deselectedTab = this.tabPanes[this.state.selectedTabIndex];
    this.newIndex = newIndex;
    deselectedTab?._onDeselect();
    this.updateState({
      selectedTabIndex: newIndex
    } as WmTabsState, () => {
      const selectedTab = this.tabPanes[newIndex];
      selectedTab?._onSelect();
      this.invokeEventCallback('onChange', [{}, this.proxy, newIndex, oldIndex]);
    });
  }

  renderWidget(props: WmTabsProps) {
    const tabpanes = React.Children.toArray(props.children)
      .filter((item: any) => item.props.show != false);
    return (
      <View style={this.styles.root}>
        <Tabs
          defaultIndex={props.defaultpaneindex}
          theme={{
            colors: {
              primary: this.styles.activeHeaderText.color as string
            }
          }}
          style={{ 
            backgroundColor: this.styles.root.backgroundColor,
            elevation: 0 
          }}
          mode="scrollable"
          onChangeIndex={this.onChange.bind(this)}
          showLeadingSpace={false}>
          {tabpanes
            ? isArray(tabpanes) && tabpanes.length
              ? tabpanes.map((item: any, index: any) => this.renderTabpane(item, index))
              : this.renderTabpane(tabpanes, 0)
            : null}
        </Tabs>
      </View>
    );
  }
}
