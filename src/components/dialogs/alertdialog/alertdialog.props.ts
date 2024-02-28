import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAlertdialogProps extends BaseProps {
  animation: string = null as any;
  title? = 'Alert';
  iconclass? = 'wi wi-warning';
  alerttype? = 'error'
  oktext? = 'Ok';
  message? = 'I am an alert box!';
  modal? = false;
  closable? = true;
  onOpened?: Function = null as any;
  iconurl?: string = null as any;
  iconheight?: number = null as any;
  iconwidth?: number = null as any;
  iconmargin?: number = null as any;
}
