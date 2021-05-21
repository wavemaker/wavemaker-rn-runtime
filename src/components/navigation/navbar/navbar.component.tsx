import React from 'react';
import { Appbar } from 'react-native-paper';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmNavbarProps from './navbar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './navbar.styles';

export default class WmNavbar extends BaseComponent<WmNavbarProps> {

  constructor(props: WmNavbarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNavbarProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Appbar.Header>
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
            return (<WmIcon styles={this.styles.leftnavIcon} themeToUse={props.themeToUse} iconclass={props.backbuttoniconclass}/>);
          }} onPress={() => this.invokeEventCallback('onBackbuttonpress', [null, this])} /> )}
          <Appbar.Content title={props.title}></Appbar.Content>
      </Appbar.Header>
    ): null; 
  }
}
