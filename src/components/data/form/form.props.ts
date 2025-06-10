import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormProps extends BaseProps {
  children: any;
  dataoutput: any;
  onBeforeservicecall: any;
  onBeforesubmit: any;
  formdata: any;
  parentForm: string = '';
  metadata: any;
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
  onBeforerender: Function = () => {};
  generateComponent: Function = (metadata:any) => {};
  showinfoskeleton: boolean = false;
  enableasynccallbacks: boolean = false;
}
