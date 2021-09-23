import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormProps extends BaseProps {
  children: any;
  formWidgets: any;
  dataoutput: any;
  onBeforesubmit: any;
  formdata: any;
  title: any;
  subheading: any;
  iconclass: any;
  formSubmit: Function = () => {};
}
