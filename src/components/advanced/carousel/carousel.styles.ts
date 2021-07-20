import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmCarouselStyles = BaseStyles & {
    prevBtn: WmIconStyles,
    nextBtn: WmIconStyles,
    dotsWrapperStyle: AllStyle,
    dotStyle: AllStyle,
    dotActiveStyle: AllStyle
};

export const DEFAULT_CLASS = 'app-carousel';
export const DEFAULT_STYLES: WmCarouselStyles = {
    root: {},
    text: {},
    prevBtn : {
        icon : {
            color: '#ffffff'
        }
    } as WmIconStyles,
    nextBtn : {
        icon : {
            color: '#ffffff'
        }
    } as WmIconStyles,
    dotsWrapperStyle:{},
    dotStyle: {
        backgroundColor: '#ffffff'
    },
    dotActiveStyle: {
        backgroundColor: '#ff0000'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('app-carousel-with-no-nav', DEFAULT_CLASS, {
    prevBtn: {
        root: {
            opacity: 0,
            left: -1000
        }
    },
    nextBtn: {
        root: {
            opacity: 0,
            left: -1000
        }
    }
} as WmCarouselStyles);

BASE_THEME.addStyle('app-carousel-with-no-dots', DEFAULT_CLASS, {
    dotStyle: {
        opacity: 0
    },
    dotActiveStyle: {
        opacity: 0
    }
} as WmCarouselStyles);