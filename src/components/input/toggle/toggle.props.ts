import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmToggleProps extends BaseProps {
  checkedvalue: any = true;
  uncheckedvalue: any = false;
  datavalue: any;
  readonly? = false;
  onFieldChange: any;
  invokeEvent?: Function;
}
