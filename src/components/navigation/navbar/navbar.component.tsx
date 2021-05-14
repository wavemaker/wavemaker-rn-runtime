import React from 'react';
import { Appbar } from 'react-native-paper';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

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
        {props.backbutton && 
          (<Appbar.BackAction 
            touchSoundDisabled={false} 
            onPress={() => this.invokeEventCallback('onBackbuttonpress', [null, this])}/>)}
          <Appbar.Content title={props.title}></Appbar.Content>
      </Appbar.Header>
    ): null; 
  }
}
