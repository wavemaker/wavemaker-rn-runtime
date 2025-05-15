import React from 'react';
import { Animated, LayoutChangeEvent, LayoutRectangle, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmProgressBarProps from './progress-bar.props';
import { DEFAULT_CLASS, WmProgressBarStyles } from './progress-bar.styles';
import { parseProgressBarLinearGradient } from '@wavemaker/app-rn-runtime/core/utils';
import WmTooltip from '../tooltip/tooltip.component';

export class WmProgressBarState extends BaseComponentState<WmProgressBarProps> {
  layout?: LayoutRectangle;
  tooltipWidth?: number; // Store actual measured tooltip width
}

export default class WmProgressBar extends BaseComponent<WmProgressBarProps, WmProgressBarState, WmProgressBarStyles> {
  private tooltipPosition: any = new Animated.Value(0);

  constructor(props: WmProgressBarProps) {
    super(props, DEFAULT_CLASS, new WmProgressBarProps());
  }

  // Initial estimation for tooltip width - used before measurement
  estimateInitialWidth(text: string): number {
    if (text.length <= 3) return 50;
    if (text.length <= 7) return 80;
    return Math.min(text.length * 8, 200);
  }

  renderWidget(props: WmProgressBarProps) {
    let value = (props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue);

    // But also add the more robust calculation for edge cases
    const minValue = props.minvalue;
    const maxValue = props.maxvalue;
    let progressFraction = 0;

    if (maxValue > minValue) {
        progressFraction = (props.datavalue - minValue) / (maxValue - minValue);
    } else if (props.datavalue >= maxValue && maxValue === minValue && minValue !== 0) {
        progressFraction = 1;
    } else if (props.datavalue >= maxValue) {
        progressFraction = 1;
    }

    progressFraction = Math.max(0, Math.min(1, isNaN(progressFraction) ? 0 : progressFraction));
    
    // Use the robust calculation but keep the original value for backward compatibility
    value = progressFraction;

    const styles = this.theme.mergeStyle(this.theme.getStyle(`app-${props.type}-progress-bar`), this.styles);
    const {hasLinearGradient, color1, color2, start, end} = parseProgressBarLinearGradient(styles?.root?.progressBar?.backgroundColor as string);
    const gradientColors: [string, string, ...string[]] = [color1, color2];
    const numericPercentage = Math.round(value * 100);
    const valuePercent: `${number}%` = `${numericPercentage}%`;

    // Determine tooltip text
    let tooltipText = '';
    if (props.getTooltipText) {
      // Use the callback if provided
      tooltipText = props.getTooltipText(
        props.datavalue, 
        props.minvalue, 
        props.maxvalue, 
        numericPercentage
      );
    } else {
      // Simple default - just show the datavalue
      tooltipText = String(props.datavalue);
    }

    // Use measured width if available, otherwise estimate
    const tooltipWidth = this.state.tooltipWidth || this.estimateInitialWidth(tooltipText);
    const halfWidth = tooltipWidth / 2;

    const progressBarContainerWidth = this.state.layout?.width || 0;
    const isShowTooltipPropActuallyTrue = props.showtooltip === true;
    const shouldShowTooltip = isShowTooltipPropActuallyTrue && progressBarContainerWidth > 0 && tooltipText !== '';

    // Calculate the exact position for the tooltip
    const exactPosition = progressBarContainerWidth * value;

    // When layout changes, update the tooltip position
    if (progressBarContainerWidth && this.tooltipPosition) {
      this.tooltipPosition.setValue(exactPosition);
    }
    
    return (
    <View 
    style={[styles.root, shouldShowTooltip ? { overflow: 'visible' } : null]}
    onLayout={(event: LayoutChangeEvent) => {
      // Always call the original handler first to maintain existing behavior
      if (this.handleLayout) {
        this.handleLayout(event);
      }
       // Only update layout state if tooltips are needed
      if (isShowTooltipPropActuallyTrue) {
        const newLayout = event.nativeEvent.layout;
        if (!this.state.layout || this.state.layout.width !== newLayout.width || this.state.layout.height !== newLayout.height) {
          this.setState({ layout: newLayout }, () => {
            if (this.tooltipPosition) {
              // Calculate the exact position
              const exactPos = newLayout.width * value;
              this.tooltipPosition.setValue(exactPos);
            }
          });
        }
      }
    }}
    >
      {this._background}
      <Tappable target={this} styles={{root:{width: '100%', height: '100%'}}} disableTouchEffect={this.state.props.disabletoucheffect}>
        <ProgressBar
          {...this.getTestPropsForAction('progressbar')}
          {...getAccessibilityProps(AccessibilityWidgetType.PROGRESSBAR, props)}
          animatedValue={value}
          color={styles.progressValue.color}
          style={[styles.progressBar, {height: styles.root.height || styles.progressBar.height}]}
          ></ProgressBar>
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
       {/* Add the tooltip functionality */}
       {shouldShowTooltip && (
           <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'visible',
            pointerEvents: 'none',
          }}>
            <Animated.View 
              style={{
                position: 'absolute',
                left: this.tooltipPosition,
                ...(props.tooltipdirection === "down" 
                  ? { bottom: 0 }  // Position at bottom edge for "down" direction
                  : { top: 20 }),   // Position at top edge for "up" direction
                transform: [{ translateX: -halfWidth }],
              }}
            >
              <View
                onLayout={(e) => {
                  // Measure actual tooltip width after rendering
                  const width = e.nativeEvent.layout.width;
                  if (width !== this.state.tooltipWidth) {
                    this.setState({ tooltipWidth: width });
                  }
                }}
              >
                <WmTooltip
                  showTooltip={true}
                  text={tooltipText}
                  direction={props.tooltipdirection}
                  tooltipStyle={{
                    ...styles.tooltip,
                    position: 'relative',
                    left: 0,
                    transform: [],
                  }}
                  tooltipLabelStyle={{
                    ...styles.tooltipLabel,
                  }}
                >
                  <View style={{ width: 1, height: 1 }} />
                </WmTooltip>
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}