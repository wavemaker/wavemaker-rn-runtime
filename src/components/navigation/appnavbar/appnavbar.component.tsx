import React from 'react';
import { Appbar } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import WmAppNavbarProps from './appnavbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './appnavbar.styles';

export default class WmAppNavbar extends BaseComponent<WmAppNavbarProps, BaseComponentState<WmAppNavbarProps>> {

  constructor(props: WmAppNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAppNavbarProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    let childElements;
    if (this.props.children) {
      childElements = React.Children.toArray(this.props.children).map((child, i) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, child.props);
        }
        return false;
      })
    }
    return props.show ? (
      <Appbar.Header style={this.styles.root}>
        {props.showDrawerButton && (<Appbar.Action
          touchSoundDisabled={false}
          style={this.styles.leftnavIcon}
          icon={() => {
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.leftnavpaneliconclass}/>);
          }} onPress={() => this.invokeEventCallback('onDrawerbuttonpress', [null, this])} /> )}
        {props.backbutton && (<Appbar.Action
          touchSoundDisabled={false}
          style={this.styles.leftnavIcon}
          icon={() => {
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.backbuttoniconclass} caption={props.backbuttonlabel}/>);
          }} onPress={() => this.invokeEventCallback('onBackbtnclick', [null, this])} /> )}
         {props.imgsrc && (<WmPicture themeToUse={props.themeToUse}  picturesource={props.imgsrc} />)}

          <Appbar.Content title={props.title} titleStyle={this.styles.content}></Appbar.Content>
        {props.searchbutton && (<Appbar.Action
          touchSoundDisabled={false}
          style={this.styles.leftnavIcon}
          icon={() => {
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.searchbuttoniconclass}/>);
          }} onPress={() => this.invokeEventCallback('onSearchbuttonpress', [null, this])} /> )}
        {childElements}
      </Appbar.Header>
    ): null;
  }
}
