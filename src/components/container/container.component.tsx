import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

export default class WmContainer extends BaseComponent<WmContainerProps, BaseComponentState<WmContainerProps>> {

  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmContainerProps());
  }

  renderContent(props: WmContainerProps) {
    if (props.renderPartial) {
      if (!this.state.props.isPartialLoaded) {
        this.state.props.isPartialLoaded = true;
        setTimeout(() => {
          this.invokeEventCallback('onLoad', [null, this]);
        });
      }
      return props.renderPartial();
    }
    return props.children;
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Tappable 
        onTap={(e: any) => this.invokeEventCallback('onTap', [e, this.proxy])}
        onDoubleTap={(e: any) => this.invokeEventCallback('onDoubletap', [e, this.proxy])}>
        <View style={this.styles.root}>{this.renderContent(props)}</View>
      </Tappable>
    ): null;
  }
}
