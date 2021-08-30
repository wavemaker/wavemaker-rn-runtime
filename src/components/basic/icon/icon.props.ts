import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmIconProps extends BaseProps {
  animation?: string = null as any;
  iconclass?: string = 'wi wi-star-border';
  iconposition? = 'left';
  caption? = '';
  iconsize? = 0;
  onTap?: Function;
}
