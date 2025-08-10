import { AccessibilityRole } from 'react-native';
import { PartialHostProps } from './partial-host.component';

export default class WmContainerProps extends PartialHostProps {
  animation?: string = null as any;
  animationdelay?: number = null as any;
  onLoad?: Function;
  scrollable?: Boolean = false as any;
  issticky?: Boolean = false as boolean;
  hidechildrenfromaccessibility?: boolean = false;
  accessible?: boolean = true;
  accessibilitylabel?: string;
  hint?: string;
  accessibilityrole?: AccessibilityRole;
}
