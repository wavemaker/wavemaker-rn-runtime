import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';

export default class WmListTemplateProps extends BaseProps {
  children: any;
  showskeletonchildren = true;
  hidechildrenfromaccessibility = false;
  accessible?: boolean = true;
  accessibilitylabel?: string;
  hint?: string;
  accessibilityrole?: AccessibilityRole;
}