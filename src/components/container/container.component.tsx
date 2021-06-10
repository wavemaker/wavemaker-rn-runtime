import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

export class WmContainerState extends BaseComponentState<WmContainerProps> {

}

export default class WmContainer extends BaseComponent<WmContainerProps, BaseComponentState<WmContainerProps>, WmContainerStyles> {

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

  renderWidget(props: WmContainerProps) {
    return (
      <View style={this.styles.root}>
        <Tappable target={this}>
            <View style={[{
              justifyContent: this.styles.root.justifyContent,
              alignItems: this.styles.root.alignItems
            },  this.styles.content]}>{this.renderContent(props)}</View>
        </Tappable>
      </View>
    );
  }
}
