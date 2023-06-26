import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormProps extends BaseProps {
  children: any;
  dataoutput: any;
  onBeforesubmit: any;
  formdata: any;
  parentForm: string = '';
  title: any;
  subheading: any;
  iconclass: any;
  postmessage: string = 'Data posted successfully';
  errormessage: string = 'An error occured. Please try again!';
  messagelayout: string = 'Inline';
  formSubmit: Function = () => {};
  formSuccess: Function = () => {};
  relatedData: Function = () => {};
  onSuccess: Function = () => {};
  onError: Function = () => {};
}
