import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmDialogProps extends BaseProps {
  show? = false;
  children = null as any;
  closable?= true;
  dialogtype?='design-dialog';
  iconclass? = '';
  modal? = true;
  showheader? = true;
  title? = '';
  onOpened?: Function = null as any;
}