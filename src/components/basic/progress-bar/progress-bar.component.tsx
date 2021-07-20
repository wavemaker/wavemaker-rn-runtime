import React from 'react';
import { View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmProgressBarProps from './progress-bar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmProgressBarStyles } from './progress-bar.styles';

export class WmProgressBarState extends BaseComponentState<WmProgressBarProps> {}

export default class WmProgressBar extends BaseComponent<WmProgressBarProps, WmProgressBarState, WmProgressBarStyles> {

  constructor(props: WmProgressBarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmProgressBarProps());
  }

  renderWidget(props: WmProgressBarProps) {
    const value = (props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue);
    const styles = deepCopy(this.styles, this.theme.getStyle(`app-${props.type}-progress-bar`))
    return (
    <View style={styles.root}>
      <Tappable target={this} styles={{root:{width: '100%', height: '100%'}}}>
        <ProgressBar
          progress={value}
          color={styles.progressValue.color}
          style={styles.progressBar}></ProgressBar>
      </Tappable>
    </View>); 
  }

}
