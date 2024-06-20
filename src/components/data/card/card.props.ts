import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCardProps extends BaseProps {
  children? = null as any;
  actions?: string = null as any;
  itemlabel?: string = null as any;
  itemlink?: string = null as any;
  itemicon?: string = null as any;
  itembadge?: string = null as any;
  isactive?: string = null as any;
  itemchildren?: string = null as any;
  iconclass?: string = null as any;
  imageheight?: number = 200;
  picturesource?: string = null as any;
  subheading?: string = null as any;
  title?: string = null as any;
  iconurl?: string = null as any;
  iconheight?: number = null as any;
  iconwidth?: number = null as any;
  iconmargin?: number = null as any;
}