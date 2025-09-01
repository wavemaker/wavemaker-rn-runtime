import React from 'react';
import { StickyBaseView, StickyBaseViewProps } from './sticky-base.component';
import { StickyWrapperContext } from '../sticky-wrapper';
import Animated from 'react-native-reanimated';

interface StickyNavProps extends StickyBaseViewProps {}

export class StickyNav extends StickyBaseView {
  static defaultProps = {
    show: true
  };
  static contextType = StickyWrapperContext;

  constructor(props: StickyNavProps) {
    super(props);
  }

  renderView() {
    return <StickyWrapperContext.Consumer>
      {(context) => {
        const { stickyNavAnimateStyle } = context || {};
        return (
          <Animated.View style={[stickyNavAnimateStyle as any]}
            key={`nav-${this.id}`}
          >
            {this.props.children}
          </Animated.View>
        );
      }}
    </StickyWrapperContext.Consumer>
  }
}
