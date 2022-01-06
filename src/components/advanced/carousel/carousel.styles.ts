import { ViewStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmCarouselStyles = BaseStyles & {
    btnPanel: AllStyle,
    prevBtn: WmIconStyles,
    nextBtn: WmIconStyles,
    dotsWrapperStyle: AllStyle,
    dotStyle: AllStyle,
    activeDotStyle: AllStyle
};
const btn: ViewStyle = {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderColor: ThemeVariables.transparent,
    borderWidth: 1,
    justifyContent: 'center'
};

export const DEFAULT_CLASS = 'app-carousel';
export const DEFAULT_STYLES: WmCarouselStyles = defineStyles({
    root: {
        position: 'relative'
    },
    text: {},
    btnPanel: {
        position: 'absolute',
        top: '50%',
        marginTop: -56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    prevBtn : {
        root: {
            marginLeft: 12,
            ...btn
        },
        text: {
            fontSize: 32
        },
        icon : {
            color: ThemeVariables.carouselPrevBtnColor
        }
    } as WmIconStyles,
    nextBtn : {
        root: {
            marginRight: 12,
            ...btn
        },
        text: {
            fontSize: 32
        },
        icon : {
            color: ThemeVariables.carouselNextBtnColor
        }
    } as WmIconStyles,
    dotsWrapperStyle:{
        opacity: 1,
        marginTop: -60,
        backgroundColor: ThemeVariables.carouselDotWrapperBgColor,
        alignSelf: 'center'
    },
    activeDotStyle: {
        width: 12,
        height: 12,
        borderRadius: 10,
        backgroundColor: ThemeVariables.carouselActiveDotColor,
        opacity: 1
    },
    dotStyle: {
        opacity: 0.2,
        marginHorizontal: -2,
        backgroundColor: ThemeVariables.carouselDotColor
    }
} as WmCarouselStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

BASE_THEME.addStyle('app-carousel-1', '', {
    btnPanel: {
        top: '100%'
    }
} as WmCarouselStyles);

BASE_THEME.addStyle('app-carousel-2', '', {
    btnPanel: {
        top: '100%',
        right: 0,
        width: 120
    },
    dotsWrapperStyle:{
        alignSelf: 'flex-start'
    },
    prevBtn: {
        root: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
    },
    nextBtn: {
        root: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
    }
} as WmCarouselStyles);