import React from 'react';
import { Text } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/rn-runtime/core/tappable.component';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './label.styles';

export default class WmLabel extends BaseComponent<WmLabelProps> {

  constructor(props: WmLabelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLabelProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Tappable 
        onTap={() => this.invokeEventCallback('onTap', [null, this.proxy])}
        onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}>
          <Text style={this.styles.root}>{props.caption}</Text>
      </Tappable>
    ): null;
  }
}
