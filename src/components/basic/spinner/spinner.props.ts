import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmSpinnerProps extends BaseProps {
  caption: string = 'Loading...';
  iconclass: string = 'fa fa-circle-o-notch fa-spin';
  iconsize? = 0;
  type: string = 'icon';
  image: string = null as any;
  imageheight: string = null as any;
  imagewidth: string = '20px';
}
