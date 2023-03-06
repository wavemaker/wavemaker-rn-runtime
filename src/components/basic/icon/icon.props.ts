import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmIconProps extends BaseProps {
  animation?: string = null as any;
  iconclass?: string = 'wm-sl-l sl-user';
  iconposition? = 'left';
  caption? = '';
  iconsize? = 0;
  onTap?: Function;
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
}
