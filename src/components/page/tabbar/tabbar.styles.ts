import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmTabbarStyles = BaseStyles & {
    menu: AllStyle,
    modalContent: AllStyle,
    moreMenu: AllStyle,
    moreMenuRow: AllStyle,
    tabItem: AllStyle,
    activeTabItem: BaseStyles,
    tabIcon: WmIconStyles,
    tabLabel: AllStyle,
    centerHubItem: AllStyle,
    centerHubIcon: WmIconStyles,
    centerHubLabel: AllStyle
};

export const DEFAULT_CLASS = 'app-tabbar';
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmTabbarStyles = defineStyles<WmTabbarStyles>({
        root: {
            height: 80,
            elevation: 3,
            shadowColor : themeVariables.tabShadowColor
        },
        text: {},
        menu: {
            height: '100%',
            flexDirection: 'row',
            backgroundColor: themeVariables.tabbarBackgroundColor,
            justifyContent: 'space-around',
            alignItems: 'flex-end',
        },
        modalContent: {},
        moreMenu: {
            width: '100%',
            flexDirection: 'column-reverse',
            justifyContent: 'flex-end',
            backgroundColor: themeVariables.tabbarBackgroundColor,
            ...BASE_THEME.getStyle('elevate1').root,
            shadowOffset: {
                width: 0,
                height: -6
            },
            shadowOpacity: 0.3,
            shadowRadius: 6
        },
        moreMenuRow: {
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            width: '100%',
            paddingTop: 4,
            paddingBottom: 4
        },
        tabItem: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 32,
            minWidth: 64,
            opacity: 1,
            marginBottom: 16
        },
        activeTabItem: {
            root: {
                opacity: 1,
                height: 32,
                width: 64,
                borderRadius: 50,
                marginBottom: -2,
                backgroundColor: themeVariables.tabActiveBackgroundColor
            },
            text: {
                fontWeight: '700',
                fontSize: 12,
                fontFamily: themeVariables.baseFont,
                color: themeVariables.tabLabelTextColor,
            },
            icon: {
                    color: themeVariables.tabActiveHeaderIconColor
            }
        },
        tabIcon: {
            root: {
                alignSelf: 'center',
                borderBottomColor: themeVariables.transparent,
                paddingBottom: 4
            },
            icon: {
                fontSize: 24,
                paddingRight: 0,
                color:  themeVariables.tabbarIconColor
            }
        } as WmIconStyles,
        tabLabel: {
            fontSize: 12,
            marginTop: 4,
            fontWeight: '500',
            fontFamily: themeVariables.baseFont,
            color:  themeVariables.tabbarTextColor,
            textAlign: 'center',
        },
        centerHubItem: {},
        centerHubIcon: {} as WmIconStyles, 
        centerHubLabel:{}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('tabbar-spacer', '', {
        root: {
            height: 96
        }
    });
    addStyle(DEFAULT_CLASS+ '-1', '', {
        root: {
            height: undefined
        },
        tabItem: {
            justifyContent: 'space-between' 
        },
        activeTabItem: {
            root: {
                borderTopWidth: 4,
                borderTopColor: themeVariables.tabbarIconColor
            }
        },
        tabIcon: {
            root: {
                paddingTop: 8,
                paddingBottom: 8,
                borderBottomWidth: 0
            }
        },
        tabLabel: {
            marginTop: 0
        }
    } as WmTabbarStyles);
    addStyle('clipped-tabbar', '', {
        root:{
            backgroundColor: themeVariables.transparent,
            marginTop: -88
        },
        menu: {
            backgroundColor: themeVariables.transparent
        },
        centerHubItem: {
            width: 70,
            height: 70,
            shadowColor: 'grey',
            shadowOpacity: 0.1,
            opacity: 1,
            shadowOffset: { width: 2, height: 0 },
            shadowRadius: 2,
            borderRadius: 35,
            position: 'absolute',
            bottom: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeVariables.centerHubItemColor,
            left: (themeVariables.maxWidth/2) - 35
        },
        centerHubIcon: {
            root: {
                alignSelf: 'center',
                paddingBottom: 0,
                borderBottomColor: themeVariables.transparent,
                borderBottomWidth: 0 
            },
            icon: {
                fontSize: 24,
                color:  themeVariables.centerHubIconColor
            }
        } as WmIconStyles, 
        centerHubLabel:{
            color:  themeVariables.centerHubLabelColor,
            marginTop: 0,
            paddingBottom: 4
        }
    })
});