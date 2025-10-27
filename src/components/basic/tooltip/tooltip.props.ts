import { BaseProps } from "@wavemaker/app-rn-runtime/core/base.component";
import { ReactElement } from "react";
import { TextStyle, ViewStyle } from "react-native";

export type TooltipDirection = 'up' | 'down' | 'left' | 'right';
export type TooltipMode = 'horizontal' | 'vertical';

export default class WmTooltipProps extends BaseProps {
  showTooltip?: boolean = false;
  text: string | number = "";
  tooltipStyle?: any;
  tooltipLabelStyle?: TextStyle | TextStyle[];
  tooltipTriangleStyle?: ViewStyle | ViewStyle[];
  direction?: TooltipDirection = "up";
  mode?: TooltipMode = "horizontal";
  children?: ReactElement;
};
