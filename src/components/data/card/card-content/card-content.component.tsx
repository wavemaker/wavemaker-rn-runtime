import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCardContentProps from './card-content.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCardContentStyles } from './card-content.styles';

export class WmCardContentState extends BaseComponentState<WmCardContentProps> {}

export default class WmCardContent extends BaseComponent<WmCardContentProps, WmCardContentState, WmCardContentStyles> {

  constructor(props: WmCardContentProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCardContentProps());
  }

  renderContent(props: WmCardContentProps) {
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

  renderWidget(props: WmCardContentProps) {
    return (<View style={this.styles.root}>{this.renderContent(props)}</View>); 
  }
}
