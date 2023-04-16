import React from 'react';
import { ScrollView, View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { WrapView } from '@wavemaker/app-rn-runtime/core/wrap-view.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, WmPageContentStyles } from './page-content.styles';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {

}

export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, new WmPageContentProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
  }

  public renderSkeleton(props: WmPageContentProps) {
    return props.scrollable || isWebPreviewMode() ? (
      <ScrollView contentContainerStyle={this.styles.root}>
        {props.children}
      </ScrollView>
    ) : (
      <View style={this.styles.root}>
        {props.children}
      </View>
    );
  }

  renderWidget(props: WmPageContentProps) {
    return (
    <WrapView onLoad={this.props.onContentReady}>
      {
        props.scrollable || isWebPreviewMode() ? (
          <ScrollView contentContainerStyle={this.styles.root}>
            {props.children}
          </ScrollView>
        ) : (
          <View style={this.styles.root}>
            {props.children}
          </View>
        )
      }
    </WrapView>);
  };
}
