import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import * as SwipeAnimation from '@wavemaker/app-rn-runtime/gestures/swipe.animation';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

import WmTabsProps from './tabs.props';
import { DEFAULT_CLASS, WmTabsStyles } from './tabs.styles';
import WmTabpane from './tabpane/tabpane.component';
import WmTabheader from './tabheader/tabheader.component';

export class WmTabsState extends BaseComponentState<WmTabsProps> {
  tabsShown: boolean[] = [];
  selectedTabIndex: number = 0;
}

export default class WmTabs extends BaseComponent<WmTabsProps, WmTabsState, WmTabsStyles> {
  public tabPanes = [] as WmTabpane[];
  private newIndex = 0;
  private tabLayout: LayoutRectangle = null as any;
  private tabPaneHeights: number[] = [];
  private animationView: SwipeAnimation.View | null = null as any;
  private animationHandlers = {
    bounds: (e) => {
      const activeTabIndex = this.state.selectedTabIndex,
            w = this.tabLayout?.width || 0,
            noOfTabs = this.tabPanes.length;
      return {
        lower: -1 * (activeTabIndex - (activeTabIndex === 0 ? 0 : 1)) * w,
        center: -1 * activeTabIndex * w,
        upper:  -1 * (activeTabIndex + (activeTabIndex === noOfTabs - 1 ? 0 : 1)) * w
      };
    },
    onLower: (e) => {
      this.onChange(this.state.selectedTabIndex - 1);
    },
    onUpper: (e) => {
      this.onChange(this.state.selectedTabIndex + 1);
    }
  } as SwipeAnimation.Handlers;

  constructor(props: WmTabsProps) {
    super(props, DEFAULT_CLASS, new WmTabsProps(), new WmTabsState());
  }
  
  setTabLayout(event: LayoutChangeEvent) {
    this.tabLayout = event.nativeEvent.layout;
    this.forceUpdate(() => {
      this.goToTab();
    });
  }

  setTabPaneHeights(index: number, nativeEvent: LayoutChangeEvent) {
    this.tabPaneHeights[index] = nativeEvent.nativeEvent.layout?.height;
    if (index === this.state.selectedTabIndex) {
      this.forceUpdate();
    }
  }

  setTabShown(tabIndex: number, callback: () => any) {
    if (!this.state.tabsShown[tabIndex]) {
      const tabsShown = [...this.state.tabsShown];
      tabsShown[tabIndex] = true;
      setTimeout(() => {
        this.updateState({
          tabsShown: tabsShown
        } as WmTabsState, callback);
      }, 300);
    } else {
      callback && callback();
    }
  }

  addTabPane(tabPane: WmTabpane) {
    const i = this.tabPanes.findIndex(t => t.props.name === tabPane.props.name);
    if (i >= 0) {
      this.tabPanes[i] = tabPane;
    } else {
      this.tabPanes[this.newIndex++] = tabPane;
    }
  }

  selectTabPane(tabPane: WmTabpane) {
    this.goToTab(this.tabPanes.indexOf(tabPane));
  }

  get selectedTabPane() {
    return this.tabPanes[this.state.selectedTabIndex];
  }

  goToTab(index = this.state.selectedTabIndex) {
    const position = -1 * index * (this.tabLayout?.width || 0);
    this.animationView?.setPosition(position)
      .then(() => this.onChange(index));
  }

  prev() {
    this.animationView?.goToLower();
  }

  next() {
    this.animationView?.goToLower();
  }

  onChange(newIndex: number) {
    if (newIndex < 0 || newIndex >= this.tabPanes.length) {
      return;
    }
    const oldIndex = this.state.selectedTabIndex;
    const deselectedTab = this.tabPanes[this.state.selectedTabIndex];
    this.newIndex = newIndex;
    deselectedTab?._onDeselect();
    this.updateState({
      selectedTabIndex: newIndex
    } as WmTabsState, () => {
      this.setTabShown(newIndex, () => {
        const selectedTab = this.tabPanes[newIndex];
        selectedTab?._onSelect();
        this.invokeEventCallback('onChange', [{}, this.proxy, newIndex, oldIndex]);
      });
    });
  }

  public renderSkeleton(props: WmTabsProps){
    const tabPanes =  React.Children.toArray(this.props.children)
    .filter((item: any, index: number) => item.props.show != false);
    const headerData = tabPanes.map((p: any, i: number) => 
      ({title: p.props.title || 'Tab Title', icon: '', key:  `tab-${p.props.title}-${i}`}));
    return(
      <View style={[this.styles.root, { borderBottomWidth: 0}]}>
      <View onLayout={this.setTabLayout.bind(this)} style={{width: '100%'}}></View>
      <WmTabheader
        styles={this.styles.tabHeader}
        data={headerData}
        showskeleton={this.props.showskeleton}
        selectedTabIndex={this.state.selectedTabIndex}
      ></WmTabheader>
      <View 
        //{...this.panResponder.panHandlers}
        style={{
          width: '100%',
          //height: this.tabPaneHeights[this.state.selectedTabIndex],
          overflow: 'hidden'
        }} >
        <View style={{
          flexDirection: 'row',
          flexWrap: 'nowrap'
        }}>
          {tabPanes.map((p: any, i) => {
            return (
            <View
              key={`tab-${p.props.title}-${i}`}
              style={{width: '100%', alignSelf: 'flex-start'}}
              onLayout={this.setTabPaneHeights.bind(this, i)}>
              {/* {this.state.tabsShown[i] ? p : null} */}
              {p}
            </View>);
          })}
        </View>
      </View>
    </View>

    )
  }

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case "defaultpaneindex":
        const selectedIndex = $new || 0;
        const tabsShown: boolean[] = [];
        tabsShown[selectedIndex] = true;
        this.updateState({
          selectedTabIndex: selectedIndex,
          tabsShown: tabsShown
        } as WmTabsState);
    }
  }
  
  renderWidget(props: WmTabsProps) {
    const tabPanes =  React.Children.toArray(props.children)
      .filter((item: any, index: number) => item.props.show != false);
    const headerData = tabPanes.map((p: any, i: number) => 
      ({title: p.props.title || 'Tab Title', icon: '', key:  `tab-${p.props.title}-${i}`}));
    return (
      <View style={this.styles.root}>
        {this._background}
        <View onLayout={this.setTabLayout.bind(this)} style={{width: '100%'}}></View>
        <WmTabheader
          id={this.getTestId('headers')}
          styles={this.styles.tabHeader}
          data={headerData}
          selectedTabIndex={this.state.selectedTabIndex}
          onIndexChange={this.goToTab.bind(this)}
        ></WmTabheader>
        <View
          style={[{
            width: '100%',
            flex: 1
          }, this.styles.root.height ? 
          (isWebPreviewMode() ? {'overflow-x': 'hidden','overflow-y': 'auto'} as any : {overflow: 'scroll'}) 
          : {
            overflow: 'hidden',
            maxHeight: this.tabPaneHeights[this.state.selectedTabIndex],
          }, this.styles.tabContent]} >
          <SwipeAnimation.View 
            enableGestures={props.enablegestures}
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'flex-start'
            }}
            direction='horizontal'
            ref={(r) => {this.animationView = r}}
            handlers = {this.animationHandlers}
          >
            {tabPanes.map((p: any, i) => {
              return (
              <View 
                key={`tab-${p.props.title}-${i}`}
                style={{
                  width: '100%',
                  height: this.styles.root.height  ? undefined : 1000000,
                  alignSelf: 'flex-start'}}>
                <View
                  style={{width: '100%', alignSelf: 'flex-start'}}
                  onLayout={this.setTabPaneHeights.bind(this, i)}>
                  {/* {this.state.tabsShown[i] ? p : null} */}
                  {p}
                </View>
              </View>);
            })}
          </SwipeAnimation.View>
        </View>
      </View>
    );
  }
}
