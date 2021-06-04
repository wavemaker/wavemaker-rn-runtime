import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmNavbarProps extends BaseProps {
  type: string = 'pills';
  layout: string = '';
  children?: any;
}
