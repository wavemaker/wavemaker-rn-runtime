import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import React from 'react';

export default class WmCarouselProps extends BaseProps {
  dataset: any = null;
  type?: 'static' | 'dynamic' = 'static';
  animation?: 'auto' | 'none' = 'auto';
  animationinterval?: number = 3;
  controls?: 'both' | 'none' | 'navs' | 'indicators' = 'both';
  children? = null as any;
  itemkey?: ($item: any, $index: any) => any = null as any;
  renderSlide?: ($item: any, $index: number, carousel: any) => React.ReactNode;
  enablegestures  = true;
  maxnoofdots = 20;
  showskeletonchildren?: boolean = false;
}