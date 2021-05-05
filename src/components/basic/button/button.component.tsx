import React from 'react';
import { Text } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/rn-runtime/core/tappable.component';

import WmButtonProps from './button.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './button.styles';

export default class WmButton extends BaseComponent<WmButtonProps> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmButtonProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Tappable 
        styles={this.styles.button}
        onTap={() => this.invokeEventCallback('onTap', [null, this.proxy])}
        onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}>
          <Text style={this.styles.text}>{props.caption}</Text>
      </Tappable>
    ): null; 
  }
}
