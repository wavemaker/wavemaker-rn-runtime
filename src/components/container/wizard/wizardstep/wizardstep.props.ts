import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmWizardstepProps extends BaseProps {
  children: any;
  enableskip: boolean = false;
  iconclass: string = 'wi wi-done';
  title: string = 'Step Title';
  index: number = 0;
}
