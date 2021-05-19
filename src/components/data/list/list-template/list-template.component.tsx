import React from 'react';
import { View } from 'react-native';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmListTemplateProps from './list-template.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './list-template.styles';

export default class WmListTemplate extends BaseComponent<WmListTemplateProps> {

  constructor(props: WmListTemplateProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmListTemplateProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      (<View style={this.styles.root}>{props.children}</View>)
    ): null; 
  }
}
