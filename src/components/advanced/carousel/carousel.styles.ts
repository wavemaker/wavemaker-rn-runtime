import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmCarouselStyles = BaseStyles & {
    btnPanel: AllStyle,
    prevBtn: WmIconStyles,
    nextBtn: WmIconStyles,
    dotsWrapperStyle: AllStyle,
    dotStyle: AllStyle,
    activeDotStyle: AllStyle
};

export const DEFAULT_CLASS = 'app-carousel';
export const DEFAULT_STYLES: WmCarouselStyles = {
    root: {
        position: 'relative'
    },
    text: {},
    btnPanel: {
        position: 'absolute',
        top: '50%',
        marginTop: -24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    prevBtn : {
        root: {
            marginLeft: 12,
        },
        icon : {
            color: ThemeVariables.carouselPrevBtnColor
        }
    } as WmIconStyles,
    nextBtn : {
        root: {
            marginRight: 12
        },
        icon : {
            color: ThemeVariables.carouselNextBtnColor
        }
    } as WmIconStyles,
    dotsWrapperStyle:{
        marginTop: -24,
        backgroundColor: ThemeVariables.carouselDotWrapperBgColor
    },
    activeDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: ThemeVariables.carouselActiveDotColor,
        opacity: 1
    },
    dotStyle: {
        opacity: 1,
        backgroundColor: ThemeVariables.carouselDotColor
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);