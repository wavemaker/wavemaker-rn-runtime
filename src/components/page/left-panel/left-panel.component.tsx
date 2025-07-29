import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLeftPanelProps from './left-panel.props';
import { DEFAULT_CLASS, WmLeftPanelStyles } from './left-panel.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { FixedViewContainer } from '@wavemaker/app-rn-runtime/core/fixed-view.component';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';

export class WmLeftPanelState extends BaseComponentState<WmLeftPanelProps> {
  isPartialLoaded = false;
}

export default class WmLeftPanel extends BaseComponent<WmLeftPanelProps, WmLeftPanelState, WmLeftPanelStyles> {
  private appConfig = injector.get<AppConfig>('APP_CONFIG');
  
  constructor(props: WmLeftPanelProps) {
    super(props, DEFAULT_CLASS, new WmLeftPanelProps());
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [null, this]);
  }

  renderContent(props: WmLeftPanelProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmLeftPanelState);
        });
      }
      return props.renderPartial(props, this.onPartialLoad.bind(this));
    }
    return props.children;
  }

  renderWidget(props: WmLeftPanelProps) {
    return (
      <SafeAreaInsetsContext.Consumer>{(insets = { top: 0, bottom: 0, left: 0, right: 0 })=>{
        const paddingTopVal = this.styles.root.paddingTop || this.styles.root.padding;
        const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
        const stylesWithFs = isEdgeToEdgeApp ? {paddingTop: (paddingTopVal || 0) as number + (insets?.top || 0) as number} : {}
       return (
        <FixedViewContainer>
          <ScrollView 
            onScroll={(event) => {this.notify('scroll', [event])}}
            scrollEventThrottle={48}
            contentContainerStyle={[this.styles.root, {width: "100%", maxWidth: "100%"},stylesWithFs]}>
            {this._background}
            {this.renderContent(props)}
          </ScrollView>
        </FixedViewContainer>)
      }}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
