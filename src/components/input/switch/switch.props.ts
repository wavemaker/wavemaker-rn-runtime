import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmSwitchProps extends BaseProps {
  dataset: any = 'yes, no, maybe';
  datavalue: any;
  dataItems: any;
  displayfield: any;
  datafield: any = 'All Fields';
  disabled: any;
  displayexpression: any;
  iconclass: any;
  getDisplayExpression: any;
  onFieldChange: any;
}
