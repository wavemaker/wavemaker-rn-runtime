import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmWizardstepProps extends BaseProps {
  disableprev: boolean = false;
  disablenext: boolean = false;
  disabledone: boolean = false;
  showprev: boolean = true;
  shownext: boolean = true;
  showdone: boolean = true;
  children: any;
  enableskip: boolean = false;
  iconclass: string = 'wm-sl-l sl-check';
  title: string = 'Step Title';
  subtitle: string = 'Sub Title';
  index: number = 0;
}
