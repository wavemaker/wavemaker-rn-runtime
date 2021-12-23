import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFormActionProps extends BaseProps {
  displayName: string = '';
  formkey: string = '';
  disabled: boolean = false;
  action: any = '';
  iconclass: any;
  formAction: Function = null as any;
}
