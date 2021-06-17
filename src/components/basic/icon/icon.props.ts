import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmIconProps extends BaseProps {
  iconclass?: string = '';
  iconposition? = 'left';
  caption? = '';
  iconsize? = 0;
  onTap?: Function;
}
