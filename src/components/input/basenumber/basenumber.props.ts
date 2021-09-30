import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseNumberProps extends BaseProps {
  datavalue: any;
  disabled: boolean = null as any;
  minvalue: number = null as any;
  maxvalue: number = null as any;
  step: number = 1;
  updateon: string = 'blur' as any;
  readonly: boolean = null as any;
  regexp: string = null as any;
  onFieldChange: any;
  required: boolean = false;
}
