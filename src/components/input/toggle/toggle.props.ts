import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmToggleProps extends BaseProps {
  checkedvalue: any;
  uncheckedvalue: any;
  datavalue: any;
  readonly? = false;
  onFieldChange: any;
}
