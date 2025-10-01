import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';
export default class WmMessageProps extends BaseProps {
  animation?: string = 'fadeIn';
  animationdelay?: number = null as any;
  title?: string = '';
  variant?: string = 'dark'
  caption? = 'Message';
  type?: 'success' | 'warning' | 'error' | 'info' | 'loading' = 'success';
  hideclose? = false;
  accessible?: boolean = true;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = 'alert';
  onClose?: () => void;
  closeiconclass?: string = 'wi wi-close';
  showanchor?: boolean = false;
  anchortext?: string = '';
  anchorhyperlink?: string = '';
  messageiconclass?: string = '';
}
