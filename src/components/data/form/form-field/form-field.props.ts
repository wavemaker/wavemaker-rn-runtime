import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormFieldProps extends BaseProps {
  children: any;
  formRef: any;
  datavalue: any;
  onChange: any;
  renderFormFields: any;
  validationmessage: any;
  required: Boolean = false;
  widget: any;
  onFieldChange: any;
  formKey: string = '';
}
