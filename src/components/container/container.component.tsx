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

  renderContent(props: WmContainerProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmContainerState,
          () => this.invokeEventCallback('onLoad', [this]));
        });
      }
      return props.renderPartial();
    }
    return props.children;
  }

  renderWidget(props: WmContainerProps) {
    return (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        <Tappable target={this}>
            <View style={[{
              width: this.styles.root.width,
              height: this.styles.root.height,
              alignItems: (this.styles.root as any)['alignContentItems']
            },  this.styles.content]}>{this.renderContent(props)}</View>
        </Tappable>
      </Animatedview>
    );
  }
}
