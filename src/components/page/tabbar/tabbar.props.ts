import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmTabbarProps extends BaseProps {
  dataset: any;
  itemlabel: string = null as any;
  itemicon: string = null as any;
  itemlink: string = null as any;
  morebuttoniconclass = 'wi wi-more-horiz';
  morebuttonlabel = 'more';
}