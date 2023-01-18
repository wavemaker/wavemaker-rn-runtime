import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCarouselTemplateStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-carousel-template';

BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCarouselTemplateStyles = defineStyles({
        root: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});