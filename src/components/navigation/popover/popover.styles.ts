import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmContainerStyles } from '@wavemaker/app-rn-runtime/components/container/container.styles';

export type WmPopoverStyles = BaseStyles & {
    link: WmAnchorStyles,
    popover: AllStyle,
    popoverContent : WmContainerStyles,
    modal: AllStyle,
    modalContent: AllStyle,
    title: AllStyle
};

export const DEFAULT_CLASS = 'app-popover';
export const DEFAULT_STYLES: WmPopoverStyles = {
    root: {
        padding: 8
    },
    text: {},
    title: {
        backgroundColor: ThemeVariables.popoverTitleBackgroundColor,
        padding: 12,
        color: ThemeVariables.popoverTitleColor,
        fontSize: 16
    },
    link: {} as WmAnchorStyles,
    popover: {
        backgroundColor: ThemeVariables.popoverBackgroundColor
    },
    popoverContent : {
        root: {
            flex: 1
        }
    } as WmContainerStyles,
    modal: {},
    modalContent: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('popover-action-sheet', DEFAULT_CLASS, {
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    popover: {
        width: '100%',
        minHeight: 240
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        maxHeight: '70%'
    }
} as WmPopoverStyles);
BASE_THEME.addStyle('popover-dropdown', DEFAULT_CLASS, {
    modal: {
        backgroundColor: 'transparent',
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
} as WmPopoverStyles);