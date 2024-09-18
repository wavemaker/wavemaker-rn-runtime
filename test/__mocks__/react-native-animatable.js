import {
  View as CoreView,
  Image as CoreImage,
  Text as CoreText,
  Animated,
} from 'react-native';

import React from 'react';

export const createAnimatableComponent = (WrappedComponent) => {
  const Animatable = Animated.createAnimatedComponent(WrappedComponent);
  return class AnimatableComponent extends React.Component {
    handleRef = (ref) => {
      this.ref = ref;
    };
    transition() {}
    stopAnimation() {}
    stopAnimations() {}
    // mock any other function you using

    render() {
      return (
        <Animatable
          ref={this.handleRef}
          {...this.props}
          //testID="animatableView"
        />
      );
    }
  };
};
export const initializeRegistryWithDefinitions = () => {};
export const View = createAnimatableComponent(CoreView);
export const Text = createAnimatableComponent(CoreImage);
export const Image = createAnimatableComponent(CoreText);
