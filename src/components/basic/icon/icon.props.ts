import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';
export default class WmIconProps extends BaseProps {
  animation?: string = null as any;
  animationdelay?: number = null as any;
  iterationcount?: any;
  iconclass?: string = 'wm-sl-l sl-user';
  iconposition? = 'left';
  caption? = '';
  iconsize? = 0;
  onTap?: Function;
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
  iconurl?: string = null as any;
  iconheight?: number = null as any;
  iconwidth?: number = null as any;
  iconmargin?: number = null as any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = 'none';
}
