import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';
import { WmAnchorStyles } from '../../basic/anchor/anchor.styles';

export type WmMenuStyles = BaseStyles & {
    icon: WmIconStyles,
    modal: AllStyle,
    modalContent: AllStyle,
    menu: AllStyle,
    menuItem: WmAnchorStyles
};

export const DEFAULT_CLASS = 'app-menu';
export const DEFAULT_STYLES: WmMenuStyles = {
    root: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {},
    icon: {} as WmIconStyles,
    modal: {
        backgroundColor: 'transparent'
    },
    modalContent: {
        position: 'absolute',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.3,
        shadowRadius: 6
    },
    menu: {
        width: 160,
        backgroundColor: '#ffffff'
    },
    menuItem: {
        root : {
            width: '100%',
            padding: 8,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            borderBottomColor: '#ddd'
        },
        icon :{
            root : {
                fontSize: 16,
            },
            icon : {
                color: '#666666'
            }
        },
        text: {
            fontSize: 16,
            textDecorationLine: 'none',
            color: '#666666'
        }
    } as WmAnchorStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
