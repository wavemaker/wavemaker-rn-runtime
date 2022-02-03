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
    height: 48,
    width: 48,
    borderRadius: 48,
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
        marginTop: -64,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    prevBtn : {
        root: {
            marginLeft: 12,
            ...btn,
            backgroundColor: ThemeVariables.carouselPrevBgColor
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
            ...btn,
            backgroundColor: ThemeVariables.carouselPrevBgColor
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
        height: 64,
        marginTop: -64,
        position: 'absolute',
        top: '100%',
        backgroundColor: ThemeVariables.carouselDotWrapperBgColor,
        alignSelf: 'center',
        paddingTop: 4,
        paddingBottom: 4
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
    },
    prevBtn: {
        root: {
            borderRadius: 6
        }
    },
    nextBtn: {
        root: {
            borderRadius: 6
        }
    }
} as WmCarouselStyles);

BASE_THEME.addStyle('app-carousel-2', '', {
    btnPanel: {
        backgroundColor: ThemeVariables.defaultColorF,
        width: '100%',
        top: '100%',
        right: 0,
        padding: 8,
        justifyContent: 'flex-end'
    },
    dotsWrapperStyle:{
        alignSelf: 'flex-start',
        justifyContent: 'flex-start'
    },
    activeDotStyle: {
        backgroundColor: ThemeVariables.primaryColor,
    },
    dotStyle: {
        backgroundColor: ThemeVariables.primaryColor,
    },
    prevBtn: {
        root: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: ThemeVariables.primaryColor,
        },
        icon : {
            color: ThemeVariables.primaryColor
        }
    },
    nextBtn: {
        root: {
            marginLeft: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: ThemeVariables.primaryColor,
        },
        icon : {
            color: ThemeVariables.primaryColor
        }
    }
} as WmCarouselStyles);