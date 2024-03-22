import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseInputProps extends BaseProps {
  autofocus: boolean = null as any;
  autocomplete: boolean = true;
  autotrim: boolean = true;
  datavalue: any;
  maxchars: number = null as any;
  readonly: boolean = null as any;
  regexp: string = null as any;
  type: string = 'text';
  updateon: string = 'blur' as any;
  required?: boolean = false as any;
  checkFormField?: any;
  onFieldChange?: any;
  triggerValidation?: any;
  maskchar: string = null as any;
  displayformat: string = null as any;
}
