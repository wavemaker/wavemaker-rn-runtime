import React from 'react';
import { ColorValue, View, ViewStyle } from 'react-native';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';

export class WmContainerState extends PartialHostState<WmContainerProps> {
  isPartialLoaded = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
  }

  renderWidget(props: WmContainerProps) {
    const dimensions = {
      width: this.styles.root.width ? '100%' : undefined,
      height: this.styles.root.height ? '100%' : undefined
    };

    const styles: ViewStyle = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root

    return (
      <Animatedview entryanimation={props.animation} delay={props.animationdelay} style={styles}>
        {this._background}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions}>
            <View style={[dimensions as ViewStyle,  this.styles.content]}>{this.renderContent(props)}</View>
        </Tappable>
      </Animatedview>
    );
  }
}
