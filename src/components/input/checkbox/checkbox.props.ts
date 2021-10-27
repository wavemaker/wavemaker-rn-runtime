import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCheckboxProps extends BaseProps {
  caption: string = null as any;
  datavalue: any;
  disabled: boolean = null as any;
  checkedvalue: any = true;
  uncheckedvalue: any = false;
  readonly: boolean = null as any;
  onFieldChange: any;
}
