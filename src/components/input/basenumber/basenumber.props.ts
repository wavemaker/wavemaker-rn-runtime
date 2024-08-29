import {AccessibilityRole} from "react-native";
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseNumberProps extends BaseProps {
  datavalue: any;
  hastwowaybinding = false;
  minvalue: number = null as any;
  maxvalue: number = null as any;
  step: number = 1;
  updateon: string = 'blur' as any;
  readonly: boolean = null as any;
  regexp: string = null as any;
  onFieldChange: any;
  required: boolean = false;
  triggerValidation: any;
  decimalPlaces: number = 2;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole;
  accessibilitylabelledby?: string = undefined;
  displayValue?: string;
}
