import React from 'react';
import { Animated, Text, View } from "react-native";
import { BaseComponent, BaseComponentState } from "@wavemaker/app-rn-runtime/core/base.component";
import WmTooltipProps from "./tooltip.props";
import { DEFAULT_CLASS, WmTooltipStyles } from "./tooltip.styles";

// * default tooltip direction - up
const directionConfig = {
  up: { rotate: '180deg', styles: {top: -60}, triangleStyles: {bottom: -10} },
  down: { rotate: '0deg', styles: {bottom: -40}, triangleStyles: {top: -10} },
  left: { rotate: '90deg', styles: {left: -40}, triangleStyles: {right: -10} },
  right: { rotate: '-90deg', styles: {right: -40}, triangleStyles: {left: -10} },
};

const verticaldirectionConfig = {
  up: { rotate: '180deg', styles: {top: -35}, triangleStyles: {bottom: -10} },
  down: { rotate: '0deg', styles: {bottom: -35}, triangleStyles: {top: -10} },
  left: { rotate: '90deg', styles: {left: -70}, triangleStyles: {right: -10} },
  right: { rotate: '-90deg', styles: {left: undefined, right: -70}, triangleStyles: {left: -10} },
};

export class WmTooltipState extends BaseComponentState<WmTooltipProps> {}

export default class WmTooltip extends BaseComponent<WmTooltipProps, WmTooltipState, WmTooltipStyles> {
  constructor(props: WmTooltipProps) {
    super(props, DEFAULT_CLASS, new WmTooltipProps());
  }
  
  renderWidget(props: WmTooltipProps) {
    const config = props.mode === 'vertical' ? verticaldirectionConfig : directionConfig;
    
    const getRotation = () => {
      if (props.direction === 'left') {
        return this.isRTL ? '-90deg' : '90deg';
      } else if (props.direction === 'right') {
        return this.isRTL ? '90deg' : '-90deg';
      } else {
        return config[props.direction || 'up'].rotate;
      }
    };
    
    return (
      <View 
        style={this.styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
      {props.showTooltip ? (
        <Animated.View
          style={[
            this.styles.tooltip,
            props.direction
              ? { ...config[props.direction].styles }
              : { top: -60 },
            props.tooltipStyle,
          ]}
        >
          <Text style={[props.tooltipLabelStyle]}>{props.text}</Text>
          <View
            style={[
              this.styles.triangle,
              {
                transform: [
                  {
                    rotate: getRotation(),
                  },
                ],
              },
              props.direction
                ? { ...config[props.direction].triangleStyles }
                : { bottom: -10 },
              { borderBottomColor: props.tooltipStyle?.backgroundColor || this.styles.tooltip.backgroundColor },
              props.tooltipTriangleStyle,
            ]}
          />
        </Animated.View>
      ) : null}
      {props.children}
    </View>
    )
  }
};
