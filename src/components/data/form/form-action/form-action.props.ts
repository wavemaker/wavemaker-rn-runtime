import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormActionProps extends BaseProps {
  displayName: string = '';
  formKey: string = '';
  action: any = '';
  show: boolean = true;
  iconclass: any;
  updateMode: boolean = true;
  formAction: Function = null as any;
}
