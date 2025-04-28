import React, { ReactNode } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Keyboard, Animated, Easing, LayoutChangeEvent, 
  NativeSyntheticEvent,  NativeScrollEvent
} from 'react-native';
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
import { FixedView } from '@wavemaker/app-rn-runtime/core/fixed-view.component';
import { EdgeInsets, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';

interface TabDataItem extends NavigationDataItem {
  floating: boolean;
  indexBeforeMid: number;
}

interface CustomScrollEvent {
  scrollDirection: number;
  scrollDelta: number;
}

const scale = (n: number) => n;

class WmTabbarState<T extends BaseNavProps> extends BaseNavState<T> {
  showMore = false;
  modalOptions = {} as ModalOptions;
  dataItems: TabDataItem[] = [];
}

export default class WmTabbar extends BaseNavComponent<WmTabbarProps, WmTabbarState<WmTabbarProps>, WmTabbarStyles> {

  private tabbarHeight = 0;
  private keyBoardShown = false;
  private destroyScrollListner: Function = null as any;
  private translateY = new Animated.Value(0);
  private insets: EdgeInsets | null = null;
  private appConfig = injector.get<AppConfig>('APP_CONFIG');
  private tabbarHeightWithInsets: number = 0;

  constructor(props: WmTabbarProps) {
    super(props, DEFAULT_CLASS, new WmTabbarProps(), new WmTabbarState());
    this.cleanup.push(Keyboard.addListener('keyboardWillShow', () => {
      this.keyBoardShown = true;
      this.forceUpdate();
    }).remove);
    this.cleanup.push(Keyboard.addListener('keyboardWillHide', () => {
      this.keyBoardShown = false;
      this.forceUpdate();
    }).remove);
  }

  private maxWidth = Dimensions.get("window").width;  
  private returnpathDown: any;

  onPropertyChange(name: string, $new: any, $old: any): void {
      super.onPropertyChange(name, $new, $old);
      switch(name){
        case 'hideonscroll':
          this.destroyScrollListner && this.destroyScrollListner();
          if($new) {
            this.subscribeToPageScroll();
          }
          break;
      }
  }

  renderTabItem(item: TabDataItem, testId: string, props: WmTabbarProps, onSelect: Function, floating = false) {

    const isActive = props.isActive && props.isActive(item);
    const getDisplayLabel = this.props.getDisplayExpression || ((label: string) => label);
    let increasedGap = Number(testId) === item?.indexBeforeMid && (this.state.dataItems.length % 2!=0)  && ((props.classname || '').indexOf('clipped-tabbar') >= 0)
    ? [this.styles.tabItem, { paddingRight: 70 }]
    : [this.styles.tabItem];
  
    return (
      <TouchableOpacity 
        {...this.getTestPropsForAction('item' + testId)}
        style={[increasedGap, floating? this.styles.centerHubItem: {}]}
        key={`${item.label}_${testId}`}
        onPress={() => onSelect && onSelect()}>
        <View key={item.key}>
          <View style={[isActive && !floating  ? this.styles.activeTabItem : {}]}>
            <WmIcon
              styles={this.theme.mergeStyle({}, this.styles.tabIcon, floating? this.styles.centerHubIcon: {}, isActive ? this.styles.activeTabIcon : {})}
              iconclass={item.icon}
            ></WmIcon>
          </View>
        </View>
        <Text style={[this.styles.tabLabel, floating? this.styles.centerHubLabel: {},  isActive ? this.styles.activeTabLabel : {}]} numberOfLines={1}>
          {getDisplayLabel(item.label)}
        </Text>
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

  isVisible(): boolean {
    return super.isVisible() && !this.keyBoardShown;
  }

  animateWithTiming(value: number, duratiion: number): void {
    Animated.timing(this.translateY, {
      toValue: value, 
      easing: Easing.linear,
      duration: duratiion, 
      useNativeDriver: false
    }).start()
  }

  subscribeToPageScroll(){
    this.tabbarHeightWithInsets = 0;
    this.destroyScrollListner = this.subscribe('scroll', (event: NativeSyntheticEvent<NativeScrollEvent>)=>{
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent ;
      const scrollPosition = contentOffset.y ;
      this.tabbarHeightWithInsets = this.tabbarHeightWithInsets ? this.tabbarHeightWithInsets : this.getLayout()?.height ;
      const visibleContentHeight = layoutMeasurement.height ;
      const endReached = (scrollPosition + visibleContentHeight + this.tabbarHeightWithInsets) >= contentSize.height ;
      const bottomInsets = this.insets?.bottom || 0
      const e = event as unknown as CustomScrollEvent;
      if(e.scrollDelta >= 2){
        if(e.scrollDirection < 0){
          this.animateWithTiming(0, 100)
        }else if(e.scrollDirection > 0) {
          this.animateWithTiming(this.tabbarHeightWithInsets + bottomInsets, 100)
        }
      }
        if(endReached){
          this.animateWithTiming(0, 0)
        }
    })
  }

  componentWillUnmount(): void {
      this.destroyScrollListner && this.destroyScrollListner();
  }

  renderContent(props: WmTabbarProps){
    let max = 5;
    const tabItems = this.state.dataItems;
    const tabItemsLength = tabItems.length;
    const isClippedTabbar = ((props.classname || '').indexOf('clipped-tabbar') >= 0) && (tabItemsLength % 2 !== 0);
    if (isClippedTabbar && tabItemsLength % 2 !== 0) {
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
      <SafeAreaInsetsContext.Consumer>
      {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
      this.insets = insets;
      const paddingBottomVal = this.styles.root.paddingBottom || this.styles.root.padding;
      const statusBarCustomisation = this.appConfig?.preferences?.statusbarStyles;
      const isFullScreenMode = !!statusBarCustomisation?.translucent;
      const stylesWithFs = isFullScreenMode ?  {height: this.styles.root.height as number + (insets?.bottom || 0) as number, 
        paddingBottom: (paddingBottomVal || 0) as number + (insets?.bottom || 0) as number} : {}
      return (
      <NavigationServiceConsumer>
      {(navigationService) =>(
        <View style={[this.styles.root, stylesWithFs]} 
          ref={(ref)=> {this.baseView = ref as any}}
          onLayout={(event: LayoutChangeEvent) => this.handleLayout(event)}  
        >
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
      )}}
    </SafeAreaInsetsContext.Consumer>
    )
  }

  renderWidget(props: WmTabbarProps) {
    this.isFixed = true;
    const animateStyle = props.hideonscroll ? {transform: [{translateY: this.translateY}]} : {};
    return <>
        <FixedView 
          style={{...{bottom: 0, width:'100%'}, ...animateStyle}} 
          theme={this.theme}
          animated={props.hideonscroll || false}>
          {this.renderContent(props)}
        </FixedView>
        <View style={{ opacity: 0}}>
          {this.renderContent(props)}
        </View>
    </>
  }
}
