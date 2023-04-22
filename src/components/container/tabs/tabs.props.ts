import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmTabsProps extends BaseProps {
  children: any;
  defaultpaneindex: number = 0;
  enablegestures = true;
}
