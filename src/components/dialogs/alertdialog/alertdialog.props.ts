import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAlertdialogProps extends BaseProps {
  title? = 'Alert';
  iconclass? = 'wi wi-warning';
  alerttype? = 'error'
  oktext? = 'Ok';
  message? = 'I am an alert box!';
  modal? = false;
  closable? = true;
  onOpened?: Function = null as any;
}