import React, { ReactNode } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';

import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { BaseNavProps } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.props';
import { BaseNavComponent, BaseNavState, NavigationDataItem } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component';

import WmTabbarProps from './tabbar.props';
import { DEFAULT_CLASS, WmTabbarStyles } from './tabbar.styles';
import Svg, { Path } from 'react-native-svg';
import { getPathDown } from './curve';
// import { scale } from 'react-native-size-scaling';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

interface TabDataItem extends NavigationDataItem {
  floating: boolean;
  indexBeforeMid: number;
}

const scale = (n: number) => n;

class WmTabbarState<T extends BaseNavProps> extends BaseNavState<T> {
  showMore = false;
  modalOptions = {} as ModalOptions;
  dataItems: TabDataItem[] = [];
}

export default class WmTabbar extends BaseNavComponent<WmTabbarProps, WmTabbarState<WmTabbarProps>, WmTabbarStyles> {

  private tabbarHeight = 0;

  constructor(props: WmTabbarProps) {
    super(props, DEFAULT_CLASS, new WmTabbarProps(), new WmTabbarState());
  }

  private maxWidth = Dimensions.get("window").width;  
  private returnpathDown: any;

  renderTabItem(item: TabDataItem, testId: string, props: WmTabbarProps, onSelect: Function, floating = false) {

    const isActive = props.isActive && props.isActive(item);
    const getDisplayLabel = this.props.getDisplayExpression || ((label: string) => label);
    let increasedGap = Number(testId) === item?.indexBeforeMid && (this.state.dataItems.length % 2!=0)  && ((props.classname || '').indexOf('clipped-tabbar') >= 0)
    ? [this.styles.tabItem, { paddingRight: 70 }]
    : [this.styles.tabItem];
  
    return (
      <View style={[this.styles.tabItem]} key={`${item.label}_${testId}`}>
        <TouchableOpacity
          {...this.getTestPropsForAction('item' + testId)}
          onPress={() => onSelect && onSelect()}
          key={item.key}
        >
          <View style={[isActive ? this.styles.activeTabItem : {}]}>
            <WmIcon
              styles={this.theme.mergeStyle({}, this.styles.tabIcon, isActive ? this.styles.activeTabIcon : {})}
              iconclass={item.icon}
            ></WmIcon>
          </View>
        </TouchableOpacity>
        <Text style={[this.styles.tabLabel, isActive ? this.styles.activeTabLabel : {}]}>
          {getDisplayLabel(item.label)}
        </Text>
      </View>
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
    const tabItemsLength = tabItems.length;
    const isClippedTabbar = ((props.classname || '').indexOf('clipped-tabbar') >= 0) && (tabItemsLength % 2 !== 0);
    if (tabItemsLength % 2 !== 0) {
      const middleIndex = Math.floor(tabItemsLength / 2);
      tabItems[middleIndex]['floating'] = true;
      tabItems[middleIndex - 1]['indexBeforeMid'] = middleIndex-1;
    }
   this.returnpathDown = getPathDown(this.maxWidth, 65 ,60,this.styles.root.height as number);
    const moreItems = [] as any[][];
    if (tabItems.length > max) {
      const moreItemsCount = Math.ceil((tabItems.length + 1 - max)/ max) * max;
      let j = 0;
      for (let i = max-1; i < moreItemsCount;) {
        const row = [];
        for (let j = 0; j < max; j++) {
          row[j] = tabItems[i++] || {key: 'tabItem' + i} as TabDataItem;
        }
        moreItems.push(row);
      }
      max = max - 1;
    }
    return (
      <NavigationServiceConsumer>
        {(navigationService) =>
        (<View style={this.styles.root}>
         {isClippedTabbar ? (
        <Svg width={this.maxWidth} height={scale(this.styles.root.height as number)} style={{zIndex: -1,position: 'absolute',backgroundColor: ThemeVariables.INSTANCE.transparent}}>
        <Path fill={ThemeVariables.INSTANCE.tabbarBackgroundColor} {...{ d: this.returnpathDown }}/>
        </Svg>
           ): <></>}   
          <ModalConsumer>
            {(modalService: ModalService) => {
              if (this.state.showMore) {
                modalService.showModal(this.prepareModalOptions((
                <ThemeProvider value={this.theme} >
                  <View style={this.styles.moreMenu}>
                    {moreItems.map((a, i) =>
                      (<View key={i} style={this.styles.moreMenuRow}>
                        {a.map((item, index) => this.renderTabItem(item, i + '', props,  () => this.onItemSelect(item, navigationService)))}
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
              .map((item, i) => this.renderTabItem(item, i + '', props, () => this.onItemSelect(item, navigationService), item.floating))}
            {tabItems.length > max && (
              this.renderTabItem({
                label: props.morebuttonlabel,
                icon: props.morebuttoniconclass
              } as TabDataItem, 6666 +'', props,  () => {
                this.updateState({showMore: !this.state.showMore} as WmTabbarState<WmTabbarProps>);
              })
            )}
          </View>
        </View>)}
      </NavigationServiceConsumer>
    );
  }
}
