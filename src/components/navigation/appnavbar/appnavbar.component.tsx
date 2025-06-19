import React from 'react';
import { Text, View, BackHandler, Animated } from 'react-native';
import { Badge } from 'react-native-paper';

import { isAndroid, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, WmAppNavbarStyles } from './appnavbar.styles';

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { StickyContext, StickyContextType, StickyNav } from '@wavemaker/app-rn-runtime/core/sticky-container.component';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {}

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, WmAppNavbarState, WmAppNavbarStyles> {

  private onDrawerBtnPress: Function;
  private onBackBtnPress: Function;
  private onSearchBtnPress: Function;
  private appConfig = injector.get<AppConfig>('APP_CONFIG');
  static contextType = StickyContext;

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

  renderContent(props: WmAppNavbarProps) {
    //@ts-ignore
    const badge = props.badgevalue != undefined ? (<Badge style={this.styles.badge} {...this.getTestProps('badge')}>{props.badgevalue}</Badge>): null;
    const { navHeight } = this.context as StickyContextType;
    let navHeightValue;
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          const paddingTopVal = this.styles.root.paddingTop || this.styles.root.padding;
          const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
          const stylesWithFs = isEdgeToEdgeApp ?  {height: this.styles.root.height as number + (insets?.top || 0) as number, 
          paddingTop: (paddingTopVal || 0) as number + (insets?.top || 0) as number} : {}
          return (
          <View style={[this.styles.root, stylesWithFs]} ref={ref => {this.baseView = ref as View}} onLayout={(event) => {
            if(navHeight) {
              if((isEdgeToEdgeApp && insets?.top) || !isEdgeToEdgeApp){
                navHeightValue = event.nativeEvent.layout.height || 0;
                navHeight.value = navHeightValue;
                this.notify('updateNavHeight', [navHeightValue]);
              }
            }
            this.handleLayout(event);
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
    return this.props.hideonscroll ? (
      <StickyNav
        component={this}
        theme={this.theme}
      >
        {this.renderContent(props)}
      </StickyNav>
    ) : this.renderContent(props)
  }
}
