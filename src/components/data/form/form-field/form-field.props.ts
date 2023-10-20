import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormFieldProps extends BaseProps {
  children: any;
  formRef: any;
  defaultvalue: any;
  generator: string = '';
  datavalue: any;
  onChange: any;
  renderFormFields: any;
  validationmessage: any;
  required: Boolean = false;
  primaryKey: Boolean = false;
  isRelated: any;
  widget: any;
  onFieldChange: any;
  formKey: string = '';
  dataset: any;
  displayfield: any;
  datafield: string = '';
  isDataSetBound: boolean = false;
  readonly: boolean = false;
  onValidate?: Function;
  show: Boolean = true;
}
