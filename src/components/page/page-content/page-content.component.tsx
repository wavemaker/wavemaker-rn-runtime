import React from 'react';
import { View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, WmPageContentStyles } from './page-content.styles';
import { ScrollView } from 'react-native-gesture-handler';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {

}

export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, new WmPageContentProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
  }

  renderWidget(props: WmPageContentProps) {
    const showScrollbar = (this.styles.root as any).scrollbarColor != 'transparent';
    return props.scrollable || isWebPreviewMode() ? (
      <View style={{height: '100%', width: '100%', backgroundColor: this.styles.root.backgroundColor}}>
        {this._background}
        <ScrollView contentContainerStyle={[this.styles.root, {backgroundColor: 'transparent'}]}
          showsVerticalScrollIndicator={showScrollbar}
          onScroll={(event) => {this.notify('scroll', [event])}}
          scrollEventThrottle={48}>
          {props.children}
        </ScrollView>
      </View>
    ) : (
      <View style={this.styles.root}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
