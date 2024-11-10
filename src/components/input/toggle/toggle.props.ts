import {AccessibilityRole} from 'react-native';
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmToggleProps extends BaseProps {
  checkedvalue: any = true;
  uncheckedvalue: any = false;
  datavalue: any;
  readonly? = false;
  onFieldChange: any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = "togglebutton";
  accessibilitylabelledby?: string = undefined;
  invokeEvent?: Function;
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
}
