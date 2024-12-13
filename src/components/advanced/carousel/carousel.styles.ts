import { ViewStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmCarouselStyles = BaseStyles & {
    btnPanel: AllStyle,
    prevBtn: WmIconStyles,
    slide: AllStyle,
    firstSlide: AllStyle,
    lastSlide: AllStyle,
    activeSlide: AllStyle,
    nextBtn: WmIconStyles,
    dotsWrapperStyle: AllStyle,
    dotStyle: AllStyle,
    activeDotStyle: AllStyle
    skeleton: WmSkeletonStyles
    dotSkeleton: WmSkeletonStyles
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
            position: 'relative',
            rippleColor: themeVariables.transparent
        },
        text: {},
        slide: {
            width: '100%',
            overflow: 'hidden',
            paddingHorizontal: 16,
            transform: [
                {
                    scale: 0.8
                }
            ]
        },
        firstSlide: {},
        lastSlide: {},
        activeSlide: {},
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
                backgroundColor: themeVariables.carouselPrevBgColor,
                rippleColor: themeVariables.transparent
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
                backgroundColor: themeVariables.carouselPrevBgColor,
                rippleColor: themeVariables.transparent
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
            backgroundColor: themeVariables.carouselDotWrapperBgColor,
            paddingTop: 4,
            paddingBottom: 4,
            overflow: 'hidden',
        },
        activeDotStyle: {
            backgroundColor: themeVariables.carouselActiveDotColor,
            opacity: 1,
        },
        dotStyle: {
            width: 10,
            height: 10,
            opacity: 0.6,
            borderRadius: 5,
            marginLeft: 4,
            marginRight: 4,
            backgroundColor: themeVariables.carouselDotColor
        },
        skeleton: {
            root: {
                width: '100%',
            },
            text: {}
        } as any as WmSkeletonStyles,
        dotSkeleton: {
            root: {
                width: 10,
                height: 10,
                borderRadius: 5,
                opacity: 1,
                backgroundColor: themeVariables.skeletonAnimatedBgColor    
            }
        } as any as WmSkeletonStyles

    } as WmCarouselStyles);

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle(DEFAULT_CLASS + '-rtl', '', {
        prevBtn : {
            root:{
                transform: [{rotateY: '180deg'}]
            }
        },
        nextBtn : {
            root:{
                transform: [{rotateY: '180deg'}]
            }
        }
    });

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
    } as any as WmCarouselStyles);

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
    } as any as WmCarouselStyles);
});