import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseDatasetProps extends BaseProps {
  datavalue: any;
  displayfield: any;
  datafield: any;
  disabled: boolean = null as any;
  displayexpression: any;
  getDisplayExpression: any;
  groupby: any;
  match: any;
  orderby: any;
  readonly: boolean = null as any;
  dateformat: any;
  onFieldChange: any;
}
