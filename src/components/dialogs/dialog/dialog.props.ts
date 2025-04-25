import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmDialogProps extends BaseProps {
  animation: string = null as any;
  animationdelay?: number = null as any;
  show? = false;
  children = null as any;
  closable?= true;
  dialogtype?='design-dialog';
  iconclass? = '';
  modal? = true;
  showheader? = true;
  title? = '';
  onOpened?: Function = null as any;
  iconurl?: string = null as any;
  iconheight?: number = null as any;
  iconwidth?: number = null as any;
  iconmargin?: number = null as any;
}
