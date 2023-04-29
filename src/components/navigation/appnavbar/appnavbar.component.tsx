import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, WmAppNavbarStyles } from './appnavbar.styles';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {

}

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, WmAppNavbarState, WmAppNavbarStyles> {

  private onDrawerBtnPress: Function;
  private onBackBtnPress: Function;
  private onSearchBtnPress: Function;

  constructor(props: WmAppNavbarProps) {
    super(props, DEFAULT_CLASS, new WmAppNavbarProps());
    this.onDrawerBtnPress = (() => this.invokeEventCallback('onDrawerbuttonpress', [null, this])).bind(this);
    this.onBackBtnPress = (() => this.invokeEventCallback('onBackbtnclick', [null, this])).bind(this);
    this.onSearchBtnPress = (() => this.invokeEventCallback('onSearchbuttonpress', [null, this])).bind(this);
  }

  renderWidget(props: WmAppNavbarProps) {
    return (
      <View style={this.styles.root}>
        {this._background}
        <View style={this.styles.leftSection}>
        {props.showDrawerButton && (<WmIcon
          styles={this.theme.mergeStyle({}, this.styles.action, this.styles.leftnavIcon)}
          iconclass={props.leftnavpaneliconclass}
          onTap={this.onDrawerBtnPress}
          />)}
        {props.backbutton && (<WmIcon
          styles={this.theme.mergeStyle({}, this.styles.action, this.styles.backIcon)}
          iconclass={props.backbuttoniconclass}
          caption={props.backbuttonlabel}
          onTap={this.onBackBtnPress}/>)}
        </View>
        <View style={this.styles.middleSection}>
          {props.imgsrc && (
          <WmPicture
            styles={this.styles.image}
            picturesource={props.imgsrc} />)}
          <Text style={this.styles.content}>{props.title}</Text>
        </View>
        <View style={this.styles.rightSection}>
          {props.searchbutton && (<WmIcon
            styles={this.theme.mergeStyle({}, this.styles.action, this.styles.leftnavIcon)}
            iconclass={props.searchbuttoniconclass}
            onTap={this.onSearchBtnPress}
            />)}
          {props.children}
        </View>
      </View>
    );
  }
}
