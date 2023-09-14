import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { WmAnchorStyles } from '../../basic/anchor/anchor.styles';
import { WmPopoverStyles, DEFAULT_CLASS as POPOVER_CLASS } from '../popover/popover.styles';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Platform } from 'react-native';

export type WmMenuStyles = WmPopoverStyles & {
    menu: AllStyle,
    menuItem: WmAnchorStyles
};

export const DEFAULT_CLASS = 'app-menu';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmMenuStyles = {
        root : {
            alignSelf: 'flex-start'
        },
        text: {},
        link: {
            icon: {
                root: {
                    color: themeVariables.menuIconColor
                }
            },
            text: {
                textDecorationLine: 'none',
                paddingRight: 12,
                fontWeight: 'bold',
                color: themeVariables.menuTextColor
            }
        } as WmAnchorStyles,
        popover: {
            backgroundColor: themeVariables.transparent,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0  
        },
        popoverContent: {
            //@ts-ignore
            flex: undefined
        },
        menu: {
            width: 160,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: themeVariables.menuBackgroundColor,
            borderRadius: 4
        },
        menuItem: {
            root : {
                height: 48,
                borderBottomWidth: 0,
                borderStyle: 'solid',
                borderBottomColor: themeVariables.menuItemBorderColor
            },
            icon :{
                root : {
                  fontSize: 24
                },
                icon : {
                    color: themeVariables.menuItemIconColor
                }
            },
            text: {
                fontSize: 16,
                textDecorationLine: 'none',
                color: themeVariables.menuItemTextColor
            }
        } as any as WmAnchorStyles
    };

    addStyle(DEFAULT_CLASS, POPOVER_CLASS, defaultStyles);
    addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{}:{
        root: {
            width: '100%'
        }
    });
});
