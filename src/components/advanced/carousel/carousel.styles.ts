import { ViewStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
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
export const DEFAULT_CLASS = 'app-carousel';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const btn: ViewStyle = {
        height: 48,
        width: 48,
        borderRadius: 48,
        borderColor: themeVariables.transparent,
        borderWidth: 1,
        justifyContent: 'center'
    };
    const defaultStyles: WmCarouselStyles = defineStyles({
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
                backgroundColor: themeVariables.carouselPrevBgColor
            },
            text: {
                fontSize: 32
            },
            icon : {
                color: themeVariables.carouselPrevBtnColor
            }
        } as WmIconStyles,
        nextBtn : {
            root: {
                marginRight: 12,
                ...btn,
                backgroundColor: themeVariables.carouselPrevBgColor
            },
            text: {
                fontSize: 32
            },
            icon : {
                color: themeVariables.carouselNextBtnColor
            }
        } as WmIconStyles,
        dotsWrapperStyle:{
            opacity: 1,
            height: 64,
            marginTop: -64,
            position: 'absolute',
            top: '100%',
            backgroundColor: themeVariables.carouselDotWrapperBgColor,
            alignSelf: 'center',
            paddingTop: 4,
            paddingBottom: 4
        },
        activeDotStyle: {
            width: 12,
            height: 12,
            borderRadius: 10,
            backgroundColor: themeVariables.carouselActiveDotColor,
            opacity: 1
        },
        dotStyle: {
            opacity: 0.2,
            marginHorizontal: -2,
            backgroundColor: themeVariables.carouselDotColor
        }
    } as WmCarouselStyles);

    addStyle(DEFAULT_CLASS, '', defaultStyles);

    addStyle('app-carousel-1', '', {
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

    addStyle('app-carousel-2', '', {
        btnPanel: {
            backgroundColor: themeVariables.defaultColorF,
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
            backgroundColor: themeVariables.primaryColor,
        },
        dotStyle: {
            backgroundColor: themeVariables.primaryColor,
        },
        prevBtn: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: themeVariables.primaryColor,
            },
            icon : {
                color: themeVariables.primaryColor
            }
        },
        nextBtn: {
            root: {
                marginLeft: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: themeVariables.primaryColor,
            },
            icon : {
                color: themeVariables.primaryColor
            }
        }
    } as WmCarouselStyles);
});