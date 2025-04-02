import React from 'react';
import { Text, View, BackHandler } from 'react-native';
import { Badge } from 'react-native-paper';

import { isAndroid, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, WmAppNavbarStyles } from './appnavbar.styles';
import { StickyView } from '@wavemaker/app-rn-runtime/core/sticky-container.component';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {}

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, WmAppNavbarState, WmAppNavbarStyles> {

  private onDrawerBtnPress: Function;
  private onBackBtnPress: Function;
  private onSearchBtnPress: Function;

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
    return (
      <View style={this.styles.root} ref={ref => {this.baseView = ref as View}} onLayout={(event) => this.handleLayout(event)}>
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
    );
  }

  renderWidget(props: WmAppNavbarProps){
    if(props.hideonscroll) this.isSticky = true;
    return props.hideonscroll ? 
      <StickyView
        theme={this.theme}
        component={this}
        slide={true}
      >
        {this.renderContent(props)}
      </StickyView>
      : this.renderContent(props);
  }
}
