import React from 'react';
import * as Animatable from 'react-native-animatable';
import { initializeRegistryWithDefinitions } from 'react-native-animatable';
import { ViewProps, ViewStyle } from 'react-native';

export default class AnimatedviewProps {
  entryanimation?: string = null as any;
  children?: any;
  duration?: number = null as any;
  style?: any;
  exitanimation?: string = null as any;
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
  zoomInUp: 'zoomOutDown'
};

const CustomAnimationMap: any = {
  slideInDown : {
    from: { translateY: -20 },
    to: { translateY: 0 }
  },
  slideInUp : {
    from: { translateY: 20 },
    to: { translateY: 0 }
  },
  slideOutUp: {
    from: { translateY: 0 },
    to: { translateY: -20 }
  },
  slideOutDown : {
    from: { translateY: 0 },
    to: { translateY: 20 }
  },
  fadeInDown: {
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 }
  },
  fadeInUp: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 }
  },
  fadeOutDown: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: 20 }
  },
  fadeOutUp: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: -20 }
  }
};

export class Animatedview extends React.Component<AnimatedviewProps> {
  private view: Animatable.View = null as any;

  constructor(props: AnimatedviewProps) {
    super(props);
    initializeRegistryWithDefinitions(CustomAnimationMap);
  }

  triggerEntry() {
    return (this as any).view.animate(this.props.entryanimation).then((endState: any) => endState.finished)
  }

  triggerExit() {
    if (this.props.exitanimation) {
      return (this as any).view.animate(this.props.exitanimation, 800, 1).then((endState: any) => endState.finished)
    } else {
      return (this as any).view.animate(AnimationMap[this.props.entryanimation || ''], 800, 1).then((endState: any) => endState.finished)
    }
  }

  // @ts-ignore
  handleViewRef = (ref: Animatable.View<ViewProps, ViewStyle>) => this.view = ref;

  render() {
    return (
     <Animatable.View
       animation={this.props.entryanimation}
       duration={this.props.duration || 800}
       useNativeDriver={true}
       style={this.props.style}
       ref={this.handleViewRef}>
        {this.props.children}
      </Animatable.View>
    );
  }
}