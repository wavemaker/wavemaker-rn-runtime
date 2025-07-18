import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';

export default class WmTabpaneProps extends BaseProps {
  children?: any;
  paneicon?: string = null as any;
  title: string = 'Tab Title';
  renderPartial?: Function;
  isPartialLoaded? = false;
  invokeVariables = true;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole;
}
