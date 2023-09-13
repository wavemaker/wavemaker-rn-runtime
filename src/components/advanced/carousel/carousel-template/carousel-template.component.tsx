import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCarouselTemplateProps from './carousel-template.props';
import { DEFAULT_CLASS, WmCarouselTemplateStyles } from './carousel-template.styles';

export class WmCarouselTemplateState extends BaseComponentState<WmCarouselTemplateProps> {}

export default class WmCarouselTemplate extends BaseComponent<WmCarouselTemplateProps, WmCarouselTemplateState, WmCarouselTemplateStyles> {

  constructor(props: WmCarouselTemplateProps) {
    super(props, DEFAULT_CLASS, new WmCarouselTemplateProps());
  }

  renderWidget(props: WmCarouselTemplateProps) {
    return (<View style={[this.styles.root, {
      height: this.styles.root.height || (this.parent?.styles.root.height && '100%')
    }]}>{this._background}{props.children}</View>);  
  }
}
