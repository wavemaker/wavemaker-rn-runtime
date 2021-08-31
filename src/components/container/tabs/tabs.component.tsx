import React from 'react';
import { View } from 'react-native';
import { isArray } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabsProps from './tabs.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTabsStyles } from './tabs.styles';
import {
  Tabs,
  TabScreen,
  } from 'react-native-paper-tabs';

export class WmTabsState extends BaseComponentState<WmTabsProps> {}

export default class WmTabs extends BaseComponent<WmTabsProps, WmTabsState, WmTabsStyles> {
  private oldIndex: any;
  constructor(props: WmTabsProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabsProps());
  }

  renderTabpane(item: any, index: any) {
    return(
      <TabScreen label={item.props.title || 'Tab Title'} key={'tabpane_' + index} icon={item.props.paneicon}>
        <View style={{flex: 1}}>{item}</View>
      </TabScreen>)
  }

  onChange(newIndex: any) {
    const props = this.state.props;
    const selectedTabName = props.children[newIndex].props.name;
    const deselectedTabName = props.children[this.oldIndex || props.defaultpaneindex].props.name;
    this.invokeEventCallback('onChange', [{}, this.proxy, newIndex, this.oldIndex || props.defaultpaneindex, selectedTabName, deselectedTabName]);
    this.oldIndex = newIndex;
  }

  renderWidget(props: WmTabsProps) {
    const tabpanes = props.children;
    return (
      <Tabs
        defaultIndex={props.defaultpaneindex}
        theme={{
          colors: {
            primary: this.styles.activeHeaderText.color
          }
        }}
        style={this.styles.root}
        mode="scrollable"
        onChangeIndex={this.onChange.bind(this)}
        showLeadingSpace={false}>
        {tabpanes
          ? isArray(tabpanes) && tabpanes.length
            ? tabpanes.map((item: any, index: any) => this.renderTabpane(item, index))
            : this.renderTabpane(tabpanes, 0)
          : null}
      </Tabs>
    );
  }
}
