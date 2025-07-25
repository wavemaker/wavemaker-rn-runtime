import React from 'react';
import { View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmProgressBarProps from './progress-bar.props';
import { DEFAULT_CLASS, WmProgressBarStyles } from './progress-bar.styles';
import { parseProgressBarLinearGradient } from '@wavemaker/app-rn-runtime/core/utils';
import WmTooltip from '../tooltip/tooltip.component';

export class WmProgressBarState extends BaseComponentState<WmProgressBarProps> {}

export default class WmProgressBar extends BaseComponent<WmProgressBarProps, WmProgressBarState, WmProgressBarStyles> {

  constructor(props: WmProgressBarProps) {
    super(props, DEFAULT_CLASS, new WmProgressBarProps());
  }

  onTooltiptext = (minValue: number, maxValue: number, percentage: number) => {
    if (this.props.showtooltip && this.props.onTooltiptext) {
      const result = this.invokeEventCallback('onTooltiptext', [
        undefined,
        this.proxy,
        minValue,
        maxValue,
        percentage
      ]);

      if (result) {
        return result;
      }
    }

    // Default fallback to percentage display
    return `${percentage}%`;
  }

  renderWidget(props: WmProgressBarProps) {
    let value = (props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue);
    const styles = this.theme.mergeStyle(this.theme.getStyle(`app-${props.type}-progress-bar`), this.styles);
    const {hasLinearGradient, color1, color2, start, end} = parseProgressBarLinearGradient(styles?.root?.progressBar?.backgroundColor as string);
    const gradientColors: [string, string, ...string[]] = [color1, color2];
    const valuePercent = `${Math.round(value * 100)}%`;
    const percentage = Math.round(value * 100);
    const progressValue = Math.min(Math.max(value, 0), 1); // Ensure value is between 0 and 1
    const progressWidth = progressValue * 100;

    return (
    <View 
      style={styles.root}
      onLayout={(event) => this.handleLayout(event)}
    >
      {this._background}
      <Tappable target={this} styles={{root:{width: '100%', height: '100%'}}} disableTouchEffect={this.state.props.disabletoucheffect}>
        <ProgressBar
          {...this.getTestPropsForAction('progressbar')}
          {...getAccessibilityProps(AccessibilityWidgetType.PROGRESSBAR, props)}
          animatedValue={value}
          color={styles.progressValue.color}
          style={[styles.progressBar, {height: styles.root.height || styles.progressBar.height}]}
        />
        
        {/* Linear Gradient for filled portion */}
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
        
        {/* Tooltip positioned at progress value */}
        {props.showtooltip ?
          (
            <View
              style={{
                position: 'absolute',
                left: `${progressWidth}%`,
                bottom: 0,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <WmTooltip
                showTooltip={props.showtooltip}
                text={this.onTooltiptext(props.minvalue, props.maxvalue, percentage)}
                direction={props.tooltipposition}
                tooltipStyle={styles.tooltip}
                tooltipLabelStyle={styles.tooltipLabel}
                tooltipTriangleStyle={styles.tooltipTriangle}
              />
            </View>
          ) : <></>}
      </Tappable>
    </View>); 
  }
}