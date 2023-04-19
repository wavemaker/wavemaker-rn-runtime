import React from 'react';
import { Animated, Easing, LayoutChangeEvent, LayoutRectangle, PanResponder, ScrollView, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

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
  private tabPosition = new Animated.Value(0);
  private tabPaneHeights: number[] = [];
  private panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.tabPosition.extractOffset();
    },
    onPanResponderMove: Animated.event([
      null,
      { dx: this.tabPosition }
    ]),
    onPanResponderRelease: (e, {dx}) => {
        this.tabPosition.flattenOffset();
        let toIndex = this.state.selectedTabIndex;
        if (Math.abs(dx) > 30) {
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
    super(props, DEFAULT_CLASS, new WmTabsProps(), new WmTabsState());
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

  animate(toIndex = this.state.selectedTabIndex) {
    return Animated.timing(this.tabPosition, {
      useNativeDriver: true,
      toValue:  -1 * toIndex * (this.tabLayout?.width || 0),
      duration: 200,
      easing: Easing.out(Easing.linear)
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
    const i = this.tabPanes.findIndex(t => t.props.name === tabPane.props.name);
    if (i >= 0) {
      this.tabPanes[i] = tabPane;
    } else {
      this.tabPanes[this.newIndex++] = tabPane;
    }
  }

  selectTabPane(tabPane: WmTabpane) {
    this.onChange(this.tabPanes.indexOf(tabPane));
  }

  goToTab(index: number) {
    this.onChange(index);
  }

  prev() {
    this.onChange(this.state.selectedTabIndex - 1);
  }

  next() {
    this.onChange(this.state.selectedTabIndex + 1);
  }

  onChange(newIndex: number) {
    if (newIndex < 0 || newIndex >= this.tabPanes.length) {
      return;
    }
    const oldIndex = this.state.selectedTabIndex;
    const deselectedTab = this.tabPanes[this.state.selectedTabIndex];
    this.newIndex = newIndex;
    deselectedTab?._onDeselect();
    this.animate(newIndex);
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
              {/* {this.state.tabsShown[i] ? p : null} */}
              {p}
            </View>);
          })}
        </Animated.View>
      </View>
    </View>

    )
  }

  renderWidget(props: WmTabsProps) {
    const tabPanes =  React.Children.toArray(props.children)
      .filter((item: any, index: number) => item.props.show != false);
    const headerData = tabPanes.map((p: any, i: number) => 
      ({title: p.props.title || 'Tab Title', icon: '', key:  `tab-${p.props.title}-${i}`}));
    return (
      <View style={this.styles.root}>
        <View onLayout={this.setTabLayout.bind(this)} style={{width: '100%'}}></View>
        <WmTabheader
          styles={this.styles.tabHeader}
          data={headerData}
          selectedTabIndex={this.state.selectedTabIndex}
          onIndexChange={this.onChange.bind(this)}
        ></WmTabheader>
        <ScrollView 
          scrollEnabled={false}
          style={{
            width: '100%',
            maxHeight: this.tabPaneHeights[this.state.selectedTabIndex]
          }} >
          <Animated.View style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            transform: [{
              translateX: this.tabPosition
            }]}}
            {...this.panResponder.panHandlers}>
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
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}
