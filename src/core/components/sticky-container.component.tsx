import React from 'react';
import { StickyWrapperContext } from "../sticky-wrapper";
import { StickyBaseView, StickyBaseViewProps } from "./sticky-base.component";
import Animated from 'react-native-reanimated';
import { View } from 'react-native';

interface StickyContainerProps extends StickyBaseViewProps {}

export class StickyContainer extends StickyBaseView {
  static defaultProps = {
    show: true
  };
  static contextType = StickyWrapperContext;

  constructor(props: StickyContainerProps) {
    super(props);
  }
  
  renderView() {
    return <StickyWrapperContext.Consumer>
      {(context) => {
        const { stickyContainerAnimateStyle } = context || {};
        return (
          <View style={{...this.props.positionStyles}}
            testID={`${this.props.name}-sticky-container`}
          >
            <Animated.View style={[ stickyContainerAnimateStyle as any, this.props.style]}
              key={`sticky-container-${this.id}`}
            >
              {this.props.children}
            </Animated.View>
          </View>
        );
      }}
    </StickyWrapperContext.Consumer>
  }
}
