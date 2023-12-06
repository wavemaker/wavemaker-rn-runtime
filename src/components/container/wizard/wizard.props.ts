import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmWizardProps extends BaseProps {
  actionsalignment: string = 'right';
  children: any;
  cancelable: boolean = true;
  cancelbtnlabel: string = 'Cancel';
  donebtnlabel: string = 'Done';
  nextbtnlabel: string = 'Next';
  previousbtnlabel: string = 'Previous';
  defaultstep: string = 'none';
  progresstitle: string = '';
  progresstype: 'default' | 'success' | 'info' | 'warning' | 'error' = 'default';
  getmenudataexpression: any = undefined;
  popovericonclass: string = 'fa fa-caret-down';
}
