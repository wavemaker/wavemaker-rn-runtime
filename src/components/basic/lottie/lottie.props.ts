import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmLottieProps extends BaseProps {
  speed  = 1;
  autoplay = false;
  loop = false;
  source: string = '';
}