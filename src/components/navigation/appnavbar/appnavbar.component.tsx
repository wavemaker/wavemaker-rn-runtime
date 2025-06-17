import React from 'react';
import { Text, View, BackHandler, Animated } from 'react-native';
import { Badge } from 'react-native-paper';

import { isAndroid, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, WmAppNavbarStyles } from './appnavbar.styles';
import { StickyView } from '@wavemaker/app-rn-runtime/core/sticky-container.component';
import { EdgeInsets, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { FixedView } from '@wavemaker/app-rn-runtime/core/fixed-view.component';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {}

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, WmAppNavbarState, WmAppNavbarStyles> {

  private onDrawerBtnPress: Function;
  private onBackBtnPress: Function;
  private onSearchBtnPress: Function;
  private appConfig = injector.get<AppConfig>('APP_CONFIG');
  private insets: EdgeInsets | null = null;
  private destroyScrollListner: Function = null as any;
  private scrollY: Animated.Value = new Animated.Value(0);
  private translateY: Animated.AnimatedInterpolation<number> = new Animated.Value(0);

  constructor(props: WmAppNavbarProps) {
    super(props, DEFAULT_CLASS, new WmAppNavbarProps());
    this.onDrawerBtnPress = (() => this.invokeEventCallback('onDrawerbuttonpress', [null, this])).bind(this);
    this.onBackBtnPress = (() => this.invokeEventCallback('onBackbtnclick', [null, this])).bind(this);
    this.onSearchBtnPress = (() => this.invokeEventCallback('onSearchbuttonpress', [null, this])).bind(this);
    if (isAndroid() && !isWebPreviewMode()) {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        this.onBackBtnPress();
        return true;
      });
      this.cleanup.push(() => subscription.remove());
    }
  }
  
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

  subscribeToPageScroll(){
    this.destroyScrollListner = this.subscribe('scroll', (e: any)=>{
      const { contentOffset } = e.nativeEvent ;
      this.scrollY.setValue(contentOffset.y);
    })
  }

  updateTranslateY(insets: any):void {
    const navbarHeight = this.getLayout()?.height ;
    const topInsets = insets?.top || 0
    if(navbarHeight){
      const navbarRange = navbarHeight + topInsets;
      this.translateY = Animated.diffClamp(this.scrollY, 0, navbarRange).interpolate({
        inputRange: [0, navbarRange],
        outputRange: [0, -1 * navbarRange],
        extrapolate: 'clamp',
      });
      this.forceUpdate();
    }
  }

  renderContent(props: WmAppNavbarProps) {
    //@ts-ignore
    const badge = props.badgevalue != undefined ? (<Badge style={this.styles.badge} {...this.getTestProps('badge')}>{props.badgevalue}</Badge>): null;
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          const paddingTopVal = this.styles.root.paddingTop || this.styles.root.padding;
          const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
          const stylesWithFs = isEdgeToEdgeApp ?  {height: this.styles.root.height as number + (insets?.top || 0) as number, 
          paddingTop: (paddingTopVal || 0) as number + (insets?.top || 0) as number} : {}
          return (
          <View style={[this.styles.root, stylesWithFs]} ref={ref => {this.baseView = ref as View}} onLayout={(event) => {
            this.handleLayout(event);
            this.updateTranslateY(insets);
          }}>
            {this._background}
            <View style={this.styles.leftSection}>
            {props.showDrawerButton && (<WmIcon
              id={this.getTestId('leftnavbtn')}
              hint={'menu'}
              styles={this.theme.mergeStyle({}, this.styles.action, this.styles.leftnavIcon)}
              iconclass={props.leftnavpaneliconclass}
              onTap={this.onDrawerBtnPress}
              />)}
            {props.backbutton && (<WmIcon
              id={this.getTestId('backbtn')}
              hint={'back'}
              styles={this.theme.mergeStyle({}, this.styles.action, this.styles.backIcon)}
              iconclass={props.backbuttoniconclass}
              caption={props.backbuttonlabel}
              onTap={this.onBackBtnPress}/>)}
            </View>
            <View style={this.styles.middleSection}>
              {props.imgsrc && (
              <WmPicture
                id={this.getTestId('picture')}
                styles={this.styles.image}
                picturesource={props.imgsrc} />)}
              <Text style={this.styles.content} {...this.getTestPropsForLabel('title')} accessibilityRole='header'>{props.title}</Text>
              {badge}
            </View>
            <View style={this.styles.rightSection}>
              {props.searchbutton && (<WmIcon
                id={this.getTestId('searchbtn')}
                styles={this.theme.mergeStyle({}, this.styles.action, this.styles.leftnavIcon)}
                iconclass={props.searchbuttoniconclass}
                onTap={this.onSearchBtnPress}
                />)}
              {props.children}
            </View>
          </View>
          )}}
      </SafeAreaInsetsContext.Consumer>
    )
  }

  renderWidget(props: WmAppNavbarProps){
    this.isFixed = true;
    const animateStyle = props.hideonscroll ? {transform: [{translateY: this.translateY}]} : {};

    return <>
        <FixedView 
          style={{...{top: 0, width:'100%'}, ...animateStyle}} 
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
