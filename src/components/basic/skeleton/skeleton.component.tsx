import React from 'react';
import { View, Animated, Easing, StyleSheet, LayoutChangeEvent, ColorValue, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Theme } from '@wavemaker/app-rn-runtime/styles/theme';

import WmSkeletonProps from './skeleton.props';
import { DEFAULT_CLASS, WmSkeletonStyles } from './skeleton.styles';
import { isUndefined } from 'lodash-es';

export class WmSkeletonState extends BaseComponentState<WmSkeletonProps> {
  layout = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  animate = false;
}

class AnimationRunner {
  private time: number = 1000;
  public speed = 1;
  private counter = 0;
  private animationValue = new Animated.Value(0.2);

  public run() {
    if (this.counter == 0) {
      return;
    }
    Animated.timing(this.animationValue, {
      duration: this.time * this.speed,
      toValue: 1,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start((event) => {
      if (event.finished) {
        this.animationValue.setValue(0)
        this.run();
      }
    });
  }

  public start() {
    this.counter++;
    if (this.counter == 1) {
      this.run();
    }
  }

  public stop() {
    this.counter = Math.max(--this.counter, 0);
  }

  public getValue() {
    return this.animationValue;
  }
}

export default class WmSkeleton extends BaseComponent<WmSkeletonProps, WmSkeletonState, WmSkeletonStyles> {

  private skeletonloaderRef: any = null;
  private animationRunner = new AnimationRunner();

  constructor(props: WmSkeletonProps) {
    super(props, DEFAULT_CLASS, new WmSkeletonProps(), new WmSkeletonState());
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.animationRunner.start();
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.animationRunner.stop();
  }

  onLayoutChange = (event: LayoutChangeEvent) => {
    this.skeletonloaderRef?.measure((x: number, y: number, width: number, height: number, px: number, py: number) => {
      let layout = {
        left: px,
        top: py,
        width: width,
        height: height,
      };
      this.setState({
        layout: {
          ...layout as any
        }, animate: true
      });
    });
  }

  renderWidget(props: WmSkeletonProps) {
    let outpuRange = [-this.state.layout.width-this.state.layout.left, this.state.layout.width + this.state.layout.height];
    let deg = -20;
    let translateX = this.animationRunner.getValue().interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 400]
    });
    return (
      <View ref={(ref) => { this.skeletonloaderRef = ref; }} onLayout={this.onLayoutChange}
        style={this.styles.root} >
        {this.state.animate ?
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              this.styles.animatedView,
              { 
                transform: [
                  { translateX },
                  { rotate: deg + 'deg' }
                ]
              }]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[this.styles.gradientForeground.backgroundColor?.toString() as string,
              this.styles.gradient.backgroundColor?.toString() as string,
              this.styles.gradientForeground.backgroundColor?.toString() as string]}
              locations={[0, 0.5, 1]}
              style={[this.styles.gradient, {backgroundColor: this.styles.animatedView.backgroundColor}]} />
          </Animated.View> : null}
      </View>);
  }
}

export const createSkeleton = (theme: Theme, skeletonStyles: WmSkeletonStyles, wrapper: ViewStyle) => {
  const style = {} as ViewStyle;
  const addStyleProp = (propName: any) => {
    if (!isUndefined((wrapper as any)[propName])) {
      (style as any)[propName] = (wrapper as any)[propName];
    }
  };
  addStyleProp('width');
  addStyleProp('height');
  addStyleProp('borderRadius');
  addStyleProp('borderRadius');
  addStyleProp('marginTop');
  addStyleProp('marginBottom');
  addStyleProp('marginLeft');
  addStyleProp('marginRight');
  return(<WmSkeleton styles={theme.mergeStyle(skeletonStyles, {root: style})}/>);
};
