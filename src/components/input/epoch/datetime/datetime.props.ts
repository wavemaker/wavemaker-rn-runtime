import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';

export default class WmDatetimeProps extends BaseProps {
  mode = 'datetime';
  datavalue?: string | Date | number = undefined as any;
  datepattern?: string = '';
  outputformat?: string = 'timestamp';
  mindate?: string | Date = undefined as any;
  maxdate?: string | Date = undefined as any;
  placeholder? = 'Select date time';
  readonly? = false;
  onFieldChange?: any;
  locale: string = '';
  timestamp?: any;
  triggerValidation?: any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = "none";
  accessibilitylabelledby?: string = undefined;
}
