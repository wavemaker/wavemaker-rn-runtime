import { BaseNavProps } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.props';

export default class WmMenuProps extends BaseNavProps {
  animateitems?: string = 'slide';
  caption?: string = '' as any;
  dataset: any = 'Menu Item 1, Menu Item 2, Menu Item 3';
  iconclass? = 'fa fa-caret-down';
}
