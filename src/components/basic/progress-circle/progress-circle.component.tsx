import React from 'react';
import { LayoutChangeEvent, View, Text } from 'react-native';
import { isNumber } from 'lodash';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmProgressCircleProps from './progress-circle.props';
import { DEFAULT_CLASS, WmProgressCircleStyles } from './progress-circle.styles';


export class WmProgressCircleState extends BaseComponentState<WmProgressCircleProps> {
  radius = 10;
}

export default class WmProgressCircle extends BaseComponent<WmProgressCircleProps, WmProgressCircleState, WmProgressCircleStyles> {

  constructor(props: WmProgressCircleProps) {
    super(props, DEFAULT_CLASS, new WmProgressCircleProps(), new WmProgressCircleState());
  }

  onLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width;
    const height = e.nativeEvent.layout.height;
    let radius = this.state.radius;
    if (!width) {
      radius = height;
    } else if (!height) {
      radius = width;
    } else {
      radius = Math.min(width, height);
    }
    
    this.handleLayout(e)

    this.updateState({
      radius: radius
    } as WmProgressCircleState);
  }

  renderWidget(props: WmProgressCircleProps) {
    let value = 0;
    if (isNumber(props.datavalue) && isNumber(props.minvalue) && isNumber(props.maxvalue)) {
      value = (+props.datavalue - (+props.minvalue)) / (+props.maxvalue - (+props.minvalue)) * 100;
    }
    const styles = this.theme.mergeStyle(this.theme.getStyle(`app-${props.type}-progress-circle`), this.styles);
    const showText = props.captionplacement !== 'hidden';
    return (
    <View style={styles.root} onLayout={this.onLayout.bind(this)} {...getAccessibilityProps(AccessibilityWidgetType.PROGRESSCIRCLE, props)} {...this.getTestPropsForAction('progresscircle')}>
      {this._background}
      <Tappable target={this} styles={{root:{width: '100%', height: '100%'}}} disableTouchEffect={this.state.props.disabletoucheffect}>
        <AnimatedCircularProgress
          fill={value}
          width={styles.progressValue.height}
          backgroundWidth={styles.progressValue.height}
          rotation={0}
          tintColor={styles.progressValue.backgroundColor}
          lineCap={styles.progressValue.buttStyle || "butt"}
          backgroundColor={styles.progressCircle.backgroundColor}
          size={this.state.radius}>
            {(fill) => (<View style={{alignItems: 'center'}}>
                          <Text style={styles.text} {...this.getTestPropsForLabel('title')}>{ showText ? props.title || value : '' }</Text>
                          {showText && props.subtitle ? (<Text style={styles.subTitle} {...this.getTestPropsForLabel('subtitle')}>{ props.subtitle }</Text>) : null}
                        </View>)}  
        </AnimatedCircularProgress>
      </Tappable>
    </View>); 
  }
}
