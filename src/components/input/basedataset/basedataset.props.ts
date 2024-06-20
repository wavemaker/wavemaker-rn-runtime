import {AccessibilityRole} from "react-native";
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseDatasetProps extends BaseProps {
  dataset: any;
  datavalue?: any;
  displayfield: any;
  datafield: any;
  displayexpression: any;
  getDisplayExpression: any;
  groupby?: any;
  match?: any;
  orderby?: any;
  readonly: boolean = null as any;
  dateformat?: any;
  onFieldChange?: any;
  displaylabel?: any;
  displayValue?: any;
  displayimagesrc: any;
  iconclass?: any;
  triggerValidation?: any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole;
  accessibilitylabelledby?: string = undefined;
}
