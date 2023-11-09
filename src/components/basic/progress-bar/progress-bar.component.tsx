import React from 'react';
import { View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmProgressBarProps from './progress-bar.props';
import { DEFAULT_CLASS, WmProgressBarStyles } from './progress-bar.styles';

export class WmProgressBarState extends BaseComponentState<WmProgressBarProps> {}

export default class WmProgressBar extends BaseComponent<WmProgressBarProps, WmProgressBarState, WmProgressBarStyles> {

  constructor(props: WmProgressBarProps) {
    super(props, DEFAULT_CLASS, new WmProgressBarProps());
  }

  renderWidget(props: WmProgressBarProps) {
    let value = (props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue);
    value = Math.round(isNaN(value) ? 0 : value);
    const styles = this.theme.mergeStyle(this.theme.getStyle(`app-${props.type}-progress-bar`), this.styles);
    return (
    <View style={styles.root}>
      {this._background}
      <Tappable {...this.getTestPropsForAction()} target={this} styles={{root:{width: '100%', height: '100%'}}}>
        <ProgressBar
          testID={this.getTestId('progressbar')}
          progress={value}
          color={styles.progressValue.color}
          style={[styles.progressBar, {height: styles.root.height || styles.progressBar.height}]}></ProgressBar>
      </Tappable>
    </View>); 
  }

}
