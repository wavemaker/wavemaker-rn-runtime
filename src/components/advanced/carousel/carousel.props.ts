import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCarouselProps extends BaseProps {
  animation?: string = 'auto';
  animationinterval?: number = 3;
  controls?: 'both' | 'none' | 'navs' | 'indicators' = 'both';
  children? = null as any;
}