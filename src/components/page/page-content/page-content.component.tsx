import React from 'react';
import { ScrollView } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPageContentStyles } from './page-content.styles';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {

}

export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <ScrollView contentContainerStyle={this.styles.root}>
        {props.children}
      </ScrollView>
    ); 
  }
}
