import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { WmAnchorStyles } from '../../basic/anchor/anchor.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmPopoverStyles, DEFAULT_STYLES as POPOVER_STYLES } from '../popover/popover.styles';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';

export type WmMenuStyles = WmPopoverStyles & {
    menu: AllStyle,
    menuItem: WmAnchorStyles
};

export const DEFAULT_CLASS = 'app-menu';
export const DEFAULT_STYLES: WmMenuStyles = deepCopy(POPOVER_STYLES, { 
    link: {
        icon: {
            root: {
                color: ThemeVariables.menuIconColor
            }
        },
        text: {
            textDecorationLine: 'none',
            paddingRight: 12,
            fontWeight: 'bold',
            color: ThemeVariables.menuTextColor
        }
    } as WmAnchorStyles,
    popoverContent: {
        flex: ''
    },
    menu: {
        width: 160,
        backgroundColor: ThemeVariables.menuBackgroundColor
    },
    menuItem: {
        root : {
            width: '100%',
            padding: 8,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            borderBottomColor: ThemeVariables.menuItemBorderColor
        },
        icon :{
            root : {
                fontSize: 16,
            },
            icon : {
                color: ThemeVariables.menuItemIconColor
            }
        },
        text: {
            fontSize: 16,
            textDecorationLine: 'none',
            color: ThemeVariables.menuItemTextColor
        }
    } as WmAnchorStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
