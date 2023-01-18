import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCarouselContentProps from './carousel-content.props';
import { DEFAULT_CLASS, WmCarouselContentStyles } from './carousel-content.styles';

export class WmCarouselContentState extends BaseComponentState<WmCarouselContentProps> {}

export default class WmCarouselContent extends BaseComponent<WmCarouselContentProps, WmCarouselContentState, WmCarouselContentStyles> {

  constructor(props: WmCarouselContentProps) {
    super(props, DEFAULT_CLASS, new WmCarouselContentProps());
  }

  renderWidget(props: WmCarouselContentProps) {
    return (<View style={this.styles.root}>{props.children}</View>); 
  }
}
