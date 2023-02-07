import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmSpinnerProps extends BaseProps {
  caption: string = 'Loading...';
  iconclass?: string = 'fa fa-circle-o-notch fa-spin';
  iconsize? = 0;
  image?: string = null as any;
  imageheight?: string = null as any;
  imagewidth?: number = 20;
  lottie?: string = null as any;
}
