import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCarouselTemplateStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-carousel-template';
export const DEFAULT_STYLES: WmCarouselTemplateStyles = {
    root: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);