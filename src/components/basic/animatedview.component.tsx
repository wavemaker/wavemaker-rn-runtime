import React from 'react';
import * as Animatable from 'react-native-animatable';
import { initializeRegistryWithDefinitions } from 'react-native-animatable';
import { View, ViewProps, ViewStyle } from 'react-native';

export default class AnimatedviewProps {
  entryanimation?: string = null as any;
  children?: any;
  duration?: number = null as any;
  delay?: number = null as any;
  iterationCount?:any;
  style?: any;
  exitanimation?: string = null as any;
  accessibilityProps?: any;
}

const AnimationMap: any = {
  bounce: 'bounce',
  flash: 'flash',
  pulse: 'pulse',
  rotate: 'rotate',
  rubberBand: 'rubberBand',
  shake: 'shake',
  swing: 'swing',
  tada: 'tada',
  wobble: 'wobble',
  bounceIn: 'bounceOut',
  bounceInDown: 'bounceOutUp',
  bounceInLeft: 'bounceOutRight',
  bounceInRight: 'bounceOutLeft',
  bounceInUp: 'bounceOutDown',
  fadeIn: 'fadeOut',
  fadeInDown: 'fadeOutUp',
  fadeInDownBig: 'fadeOutUpBig',
  fadeInLeft: 'fadeOutRight',
  fadeInLeftBig: 'fadeOutRightBig',
  fadeInRight: 'fadeOutLeft',
  fadeInRightBig: 'fadeOutLeftBig',
  fadeInUp: 'fadeOutDown',
  fadeInUpBig: 'fadeOutDownBig',
  flipInX: 'flipOutX',
  flipInY: 'flipOutY',
  lightSpeedIn: 'lightSpeedOut',
  slideInDown: 'slideOutUp',
  slideInLeft: 'slideOutRight',
  slideInRight: 'slideOutLeft',
  slideInUp: 'slideOutDown',
  zoomIn: 'zoomOut',
  zoomInDown: 'zoomOutUp',
  zoomInLeft: 'zoomOutRight',
  zoomInRight: 'zoomOutLeft',
  zoomInUp: 'zoomOutDown',
};

const CustomAnimationMap: any = {
  flipInY: {
    0: {
      transform: [{ rotateY: '0deg' }],
    },
    1: {
      transform: [{ rotateY: '360deg' }],
    },
  },
  flipInX: {
    0: {
      transform: [{ rotateX: '0deg' }],
    },
    1: {
      transform: [{ rotateX: '360deg' }],
    },
  },
  flipOutY: {
    0: {
      transform: [{ rotateY: '3600deg' }],
    },
    1: {
      transform: [{ rotateY: '0deg' }],
    },
  },
  flipOutX: {
    0: {
      transform: [{ rotateX: '360deg' }],
    },
    1: {
      transform: [{ rotateX: '0deg' }],
    },
  },
  slideInDown: {
    from: { translateY: -20 },
    to: { translateY: 0 },
  },
  slideInUp: {
    from: { translateY: 20 },
    to: { translateY: 0 },
  },
  slideOutUp: {
    from: { translateY: 0 },
    to: { translateY: -20 },
  },
  slideOutDown: {
    from: { translateY: 0 },
    to: { translateY: 20 },
  },
  fadeInDown: {
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
  },
  fadeInUp: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
  },
  fadeOutDown: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: 20 },
  },
  fadeOutUp: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: -20 },
  },
};

export class Animatedview extends React.Component<AnimatedviewProps> {
  static defaultProps: AnimatedviewProps = {
    duration: 200,
  };

  private view: Animatable.View = null as any;

  constructor(props: AnimatedviewProps) {
    super(props);
    initializeRegistryWithDefinitions(CustomAnimationMap);
  }

  triggerEntry() {
    return (this as any).view
      .animate(this.props.entryanimation, this.props.duration)
      .then((endState: any) => endState.finished);
  }

  triggerExit() {
    if (!this.view) {
      return;
    }
    if (this.props.exitanimation) {
      return (this as any).view
        .animate(this.props.exitanimation, this.props.duration, 1)
        .then((endState: any) => endState.finished);
    } else {
      return (this as any).view
        .animate(
          AnimationMap[this.props.entryanimation || ''],
          this.props.duration,
          1
        )
        .then((endState: any) => endState.finished);
    }
  }

  // @ts-ignore
  handleViewRef = (ref: Animatable.View<ViewProps, ViewStyle>) => {
    this.view = ref;
  };

  render() {
    return this.props.entryanimation ? (
     <Animatable.View
       animation={this.props.entryanimation}
       duration={this.props.duration}
       delay={this.props.delay}
       useNativeDriver={true}
       style={this.props.style}
       iterationCount={this.props.iterationCount}
       ref={this.handleViewRef}
       {...this.props.accessibilityProps}
       testID="animatableView"
       >
        {this.props.children}
      </Animatable.View>
    ): (<View style={this.props.style} {...this.props.accessibilityProps} testID="non_animatableView">{this.props.children}</View>);
  }
}
