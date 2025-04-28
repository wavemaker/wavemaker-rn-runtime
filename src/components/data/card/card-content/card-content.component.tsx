import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCardContentProps from './card-content.props';
import { DEFAULT_CLASS, WmCardContentStyles } from './card-content.styles';

export class WmCardContentState extends BaseComponentState<WmCardContentProps> {
  isPartialLoaded = false;
}

export default class WmCardContent extends BaseComponent<WmCardContentProps, WmCardContentState, WmCardContentStyles> {

  constructor(props: WmCardContentProps) {
    super(props, DEFAULT_CLASS, new WmCardContentProps());
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [null, this]);
  }

  renderContent(props: WmCardContentProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmCardContentState);
        });
      }
      return props.renderPartial(props, this.onPartialLoad.bind(this));
    }
    return props.children;
  }

  renderWidget(props: WmCardContentProps) {
    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root

    return (
      <View 
        style={styles}
        onLayout={(event) => this.handleLayout(event)}
      >
        {!this._showSkeleton ? this._background : null}
        {this.renderContent(props)}
      </View>
    );
  }
}
