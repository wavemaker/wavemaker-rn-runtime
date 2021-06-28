import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmNavItemProps extends BaseProps {
  children?: any;
  caption?: string;
  item: any = [];
  view: 'default' | 'dropdown' | 'anchor' = 'default';
}
