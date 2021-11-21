import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormActionProps extends BaseProps {
  displayName: string = '';
  formkey: string = '';
  action: any = '';
  iconclass: any;
  formAction: Function = null as any;
}
