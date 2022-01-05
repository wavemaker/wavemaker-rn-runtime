import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

export class WmContainerState extends BaseComponentState<WmContainerProps> {
  isPartialLoaded = false;
}

export default class WmContainer extends BaseComponent<WmContainerProps, WmContainerState, WmContainerStyles> {
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmContainerProps());
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [this]);
  }

  renderContent(props: WmContainerProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmContainerState);
        });
      }
      return props.renderPartial(this.onPartialLoad.bind(this));
    }
    return props.children;
  }

  renderWidget(props: WmContainerProps) {
    const dimensions = {
      width: this.styles.root.width ? '100%' : undefined,
      height: this.styles.root.height ? '100%' : undefined
    };
    return (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        <Tappable target={this} styles={dimensions}>
            <View style={[dimensions,  this.styles.content]}>{this.renderContent(props)}</View>
        </Tappable>
      </Animatedview>
    );
  }
}
