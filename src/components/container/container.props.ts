import { PartialHostProps } from './partial-host.component';
import { Animated } from 'react-native';

export default class WmContainerProps extends PartialHostProps {
  animation?: string = null as any;
  animationdelay?: number = null as any;
  onLoad?: Function;
  scrollable?: Boolean = false as any;
  sticky?: Boolean = false as boolean;
  stickyContainerVisibility?: Boolean = false;
  stickyContainerOpacity?: Animated.Value;
}
