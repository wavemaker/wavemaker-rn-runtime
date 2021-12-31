import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAppNavbarStyles } from './appnavbar.styles';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {

}

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, WmAppNavbarState, WmAppNavbarStyles> {

  private onDrawerBtnPress: Function;
  private onBackBtnPress: Function;
  private onSearchBtnPress: Function;

  constructor(props: WmAppNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAppNavbarProps());
    this.onDrawerBtnPress = (() => this.invokeEventCallback('onDrawerbuttonpress', [null, this])).bind(this);
    this.onBackBtnPress = (() => this.invokeEventCallback('onBackbtnclick', [null, this])).bind(this);
    this.onSearchBtnPress = (() => this.invokeEventCallback('onSearchbuttonpress', [null, this])).bind(this);
  }

  renderWidget(props: WmAppNavbarProps) {
    return (
      <Appbar.Header statusBarHeight={0} style={this.styles.root}>
        {props.showDrawerButton && (<WmIcon 
          styles={deepCopy({}, this.styles.action, this.styles.leftnavIcon)}
          iconclass={props.leftnavpaneliconclass}
          onTap={this.onDrawerBtnPress}
          />)}
        {props.backbutton && (<WmIcon
          styles={deepCopy({}, this.styles.action, this.styles.backIcon)}
          iconclass={props.backbuttoniconclass}
          caption={props.backbuttonlabel}
          onTap={this.onBackBtnPress}/>)}
        {props.imgsrc && (<WmPicture  picturesource={props.imgsrc} />)}
        <Appbar.Content title={props.title} titleStyle={this.styles.middleContent}></Appbar.Content>
        {props.searchbutton && (<WmIcon 
          styles={deepCopy({}, this.styles.action, this.styles.leftnavIcon)}
          iconclass={props.searchbuttoniconclass}
          onTap={this.onSearchBtnPress}
          />)}
        {props.children}
      </Appbar.Header>
    );
  }
}
