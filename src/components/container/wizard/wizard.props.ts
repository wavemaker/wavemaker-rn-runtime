import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmWizardProps extends BaseProps {
  actionsalignment: string = 'right';
  children: any;
  cancelable = true;
  cancelbtnlabel: string = 'Cancel';
  donebtnlabel: string = 'Done';
  nextbtnlabel: string = 'Next';
  previousbtnlabel: string = 'Previous';
  defaultstep: string = 'none';
}
