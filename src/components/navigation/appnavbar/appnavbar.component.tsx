import React from 'react';
import { Appbar } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAppNavbarStyles } from './appnavbar.styles';

export class WmAppNavbarState extends BaseComponentState<WmAppNavbarProps> {

}

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, WmAppNavbarState, WmAppNavbarStyles> {

  constructor(props: WmAppNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAppNavbarProps());
  }

  renderWidget(props: WmAppNavbarProps) {
    return (
      <Appbar.Header statusBarHeight={0} style={this.styles.root}>
        {props.showDrawerButton && (<Appbar.Action
          touchSoundDisabled={false}
          style={this.styles.action}
          icon={() => {
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.leftnavpaneliconclass}/>);
          }} onPress={() => this.invokeEventCallback('onDrawerbuttonpress', [null, this])} /> )}
        {props.backbutton && (<Appbar.Action
          touchSoundDisabled={false}
          animated={false}
          style={this.styles.action}
          icon={() => {
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.backbuttoniconclass} caption={props.backbuttonlabel}/>);
          }} onPress={() => this.invokeEventCallback('onBackbtnclick', [null, this])} /> )}
         {props.imgsrc && (<WmPicture themeToUse={props.themeToUse}  picturesource={props.imgsrc} />)}

          <Appbar.Content title={props.title} titleStyle={this.styles.content}></Appbar.Content>
        {props.searchbutton && (<Appbar.Action
          touchSoundDisabled={false}
          style={this.styles.action}
          icon={() => {
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.searchbuttoniconclass}/>);
          }} onPress={() => this.invokeEventCallback('onSearchbuttonpress', [null, this])} /> )}
        {props.children}
      </Appbar.Header>
    );
  }
}
