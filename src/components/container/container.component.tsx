import React from 'react';
import { View, ViewStyle } from 'react-native';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';

export class WmContainerState extends PartialHostState<WmContainerProps> {
  isPartialLoaded = false;
  showContent: boolean = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
    this.updateState({showContent: !this.state.props.deferload} as WmContainerState);
  }

  renderWidget(props: WmContainerProps) {
    if(!this.state.showContent && this.isVisible()){
      this.updateState({showContent: true} as WmContainerState);
    }
    const dimensions = {
      width: this.styles.root.width ? '100%' : undefined,
      height: this.styles.root.height ? '100%' : undefined
    };
    return this.state.showContent && (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        {this._background}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions}>
            <View style={[dimensions as ViewStyle,  this.styles.content]}>{this.renderContent(props)}</View>
        </Tappable>
      </Animatedview>
    );
  }
}
