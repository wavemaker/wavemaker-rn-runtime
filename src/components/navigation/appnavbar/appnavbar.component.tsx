import React from 'react';
import { Appbar } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAppNavbarStyles } from './appnavbar.styles';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {

}
export interface AppbarActionComponent {
  style: AllStyle,
  iconStyle: WmIconStyles,
  iconClass: string,
  onPress: Function
}

const AppbarActionComponent = React.memo((props: AppbarActionComponent) => {
  return (<Appbar.Action
    touchSoundDisabled={false}
    style={props.style}
    icon={() => {
      return (<WmIcon styles={props.iconStyle} iconclass={props.iconClass}/>);
    }} onPress={() => props.onPress()} /> )
});

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
        {props.showDrawerButton && (<AppbarActionComponent 
          style={this.styles.action}
          iconStyle={this.styles.leftnavIcon}
          iconClass={props.leftnavpaneliconclass}
          onPress={this.onDrawerBtnPress}
          />)}
        {props.backbutton && (<AppbarActionComponent 
          style={this.styles.action}
          iconStyle={this.styles.backIcon}
          iconClass={props.backbuttoniconclass}
          onPress={this.onBackBtnPress}
          />)}
        {props.imgsrc && (<WmPicture  picturesource={props.imgsrc} />)}
        <Appbar.Content title={props.title} titleStyle={this.styles.content}></Appbar.Content>
        {props.searchbutton && (<AppbarActionComponent 
          style={this.styles.action}
          iconStyle={this.styles.leftnavIcon}
          iconClass={props.searchbuttoniconclass}
          onPress={this.onSearchBtnPress}
          />)}
        {props.children}
      </Appbar.Header>
    );
  }
}
