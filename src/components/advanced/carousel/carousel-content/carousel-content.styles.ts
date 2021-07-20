import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCarouselContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-carousel-content';
export const DEFAULT_STYLES: WmCarouselContentStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);