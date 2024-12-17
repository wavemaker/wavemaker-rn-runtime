import React from 'react';
import { View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmProgressBarProps from './progress-bar.props';
import { DEFAULT_CLASS, WmProgressBarStyles } from './progress-bar.styles';
import { parseLinearGradient } from '@wavemaker/app-rn-runtime/core/utils';

export class WmProgressBarState extends BaseComponentState<WmProgressBarProps> {}

export default class WmProgressBar extends BaseComponent<WmProgressBarProps, WmProgressBarState, WmProgressBarStyles> {

  constructor(props: WmProgressBarProps) {
    super(props, DEFAULT_CLASS, new WmProgressBarProps());
  }

  renderWidget(props: WmProgressBarProps) {
    let value = (props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue);
    const styles = this.theme.mergeStyle(this.theme.getStyle(`app-${props.type}-progress-bar`), this.styles);
    const {hasLinearGradient, color1, color2, start, end} = parseLinearGradient(styles?.root?.progressBar?.backgroundColor as string);
    const gradientColors: [string, string, ...string[]] = [color1, color2];
    const valuePercent = `${Math.round(value * 100)}%`;

    return (
    <View style={styles.root}>
      {this._background}
      <Tappable target={this} styles={{root:{width: '100%', height: '100%'}}}>
        <ProgressBar
          {...this.getTestPropsForAction('progressbar')}
          {...getAccessibilityProps(AccessibilityWidgetType.PROGRESSBAR, props)}
          animatedValue={value}
          color={styles.progressValue.color}
          style={[styles.progressBar, {height: styles.root.height || styles.progressBar.height}]}></ProgressBar>
          {hasLinearGradient ? (
            <ExpoLinearGradient
              colors={gradientColors}
              start={start}
              end={end}
              style={[
                {
                  width: valuePercent as any,
                  height: styles.root.height || styles.progressBar.height,
                  position: 'absolute',
                  borderRadius: styles?.progressBar?.borderRadius || 0,
                },
              ]}
            />
          ) : (
            <></>
          )}
      </Tappable>
    </View>); 
  }

}