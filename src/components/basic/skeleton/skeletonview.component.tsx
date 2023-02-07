import React from 'react';
import SkeletonviewProps from './skeletonview.props';
import { SkeletonStyles, SkeletonviewStyles } from './skeletonview.style';
import { View, Animated, Easing, StyleSheet, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export class SkeletonviewState {
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

export class Skeletonview extends React.Component<SkeletonviewProps, SkeletonviewState, SkeletonviewStyles> {
  private skeletonloaderRef: any = null;
  private animationRunner = new AnimationRunner();

  constructor(props: SkeletonviewProps) {
    super(props);
    this.state = new SkeletonviewState();
  }

  componentDidMount(): void {
    this.animationRunner.start();
  }

  componentWillUnmount(): void {
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

  render() {
    let outpuRange = [-this.state.layout.left, this.state.layout.width + this.state.layout.left];
    let deg = -20;
    let translateX = this.animationRunner.getValue().interpolate({
      inputRange: [0, 1],
      outputRange: outpuRange
    })
    return (
      <View ref={(ref) => { this.skeletonloaderRef = ref; }} onLayout={this.onLayoutChange}
        style={[this.props.styles, SkeletonStyles.skeletonView]} >
        {this.state.animate ?
          <Animated.View
            style={[StyleSheet.absoluteFill, SkeletonStyles.animatedView, { width: this.state.layout.width / 10, transform: [{ translateX }, { rotate: deg + 'deg' }] }]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={SkeletonStyles.gradientColors}
              locations={[0, 0.5, 1]}
              style={SkeletonStyles.gradient} />
          </Animated.View> : null}
      </View>)
  }
}