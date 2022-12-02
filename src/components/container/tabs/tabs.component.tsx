import React from 'react';
import { Animated, Easing, LayoutChangeEvent, LayoutRectangle, PanResponder, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabsProps from './tabs.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTabsStyles } from './tabs.styles';

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
  private tabPosition = new Animated.Value(0);
  private tabPaneHeights: number[] = [];
  private panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.tabPosition.setOffset((this.tabPosition as any)._value);
    },
    onPanResponderMove: Animated.event([
      null,
      { dx: this.tabPosition }
    ]),
    onPanResponderRelease: () => {
      const dx = (this.tabPosition as any)._value;
      this.tabPosition.flattenOffset();
      let toIndex = this.state.selectedTabIndex;
      if (Math.abs(dx) > 50) {
        if (dx < 0) {
          if (toIndex < this.tabPanes.length - 1) {
            this.onChange(toIndex + 1);
            return;
          }
        } else if (toIndex > 0) {
          this.onChange(toIndex - 1);
          return;
        }
      }
      this.onChange(toIndex);
      this.forceUpdate();
    }
  });

  constructor(props: WmTabsProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTabsProps(), new WmTabsState());
    const selectedIndex = props.defaultpaneindex || 0;
    const tabsShown: boolean[] = [];
    tabsShown[selectedIndex] = true;
    this.updateState({
      selectedTabIndex: selectedIndex,
      tabsShown: tabsShown
    }as WmTabsState);
  }

  setTabLayout(event: LayoutChangeEvent) {
    this.tabLayout = event.nativeEvent.layout;
    this.forceUpdate();
  }

  setTabPaneHeights(index: number, nativeEvent: LayoutChangeEvent) {
    this.tabPaneHeights[index] = nativeEvent.nativeEvent.layout?.height;
    if (index === this.state.selectedTabIndex) {
      this.forceUpdate();
    }
  }

  setTabPosition() {
    Animated.timing(this.tabPosition, {
      useNativeDriver: true,
      toValue:  -1 * this.state.selectedTabIndex * (this.tabLayout?.width || 0),
      duration: 200,
      easing: Easing.linear
    }).start();
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
    this.tabPanes[this.newIndex || this.state.selectedTabIndex] = tabPane;
    this.newIndex++;
  }

  onChange(newIndex: number) {
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

  renderWidget(props: WmTabsProps) {
    const tabPanes =  React.Children.toArray(props.children)
      .filter((item: any, index: number) => item.props.show != false);
    const headerData = tabPanes.map((p: any, i: number) => 
      ({title: p.props.title || 'Tab Title', icon: '', key:  `tab-${p.props.title}-${i}`}));
    this.setTabPosition();
    return (
      <View style={this.styles.root}>
        <View onLayout={this.setTabLayout.bind(this)} style={{width: '100%'}}></View>
        <WmTabheader
          styles={this.styles.tabHeader}
          data={headerData}
          selectedTabIndex={this.state.selectedTabIndex}
          onIndexChange={this.onChange.bind(this)}
        ></WmTabheader>
        <View 
          //{...this.panResponder.panHandlers}
          style={{
            width: '100%',
            //height: this.tabPaneHeights[this.state.selectedTabIndex],
            overflow: 'hidden'
          }} >
          <Animated.View style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            transform: [{
              translateX: this.tabPosition
            }]}}>
            {tabPanes.map((p: any, i) => {
              return (
              <View
                key={`tab-${p.props.title}-${i}`}
                style={{width: '100%', alignSelf: 'flex-start'}}
                onLayout={this.setTabPaneHeights.bind(this, i)}>
                {this.state.tabsShown[i] ? p : null}
              </View>);
            })}
          </Animated.View>
        </View>
      </View>
    );
  }
}
