import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmContainerStyles } from '@wavemaker/app-rn-runtime/components/container/container.styles';
import { Dimensions } from 'react-native';

export type WmPopoverStyles = BaseStyles & {
    link: WmAnchorStyles,
    popover: AllStyle,
    popoverContent : WmContainerStyles,
    modal: AllStyle,
    modalContent: AllStyle,
    title: AllStyle
};

export const DEFAULT_CLASS = 'app-popover';
export const DEFAULT_STYLES: WmPopoverStyles = defineStyles({
    root: {
        padding: 8
    },
    text: {},
    title: {
        backgroundColor: ThemeVariables.popoverTitleBackgroundColor,
        padding: 12,
        color: ThemeVariables.popoverTitleColor,
        fontSize: 16,
        fontFamily: ThemeVariables.baseFont
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
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('popover-action-sheet', '', {
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    popover: {
        width: '100%',
        minHeight: 240,
        maxHeight: Dimensions.get('window').height - 120,
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        ...BASE_THEME.getStyle('elevate1').root,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        justifyContent: 'flex-end'
    }
} as WmPopoverStyles);
BASE_THEME.addStyle('popover-dropdown', '', {
    modal: {
        backgroundColor: 'transparent',
    },
    popover: {
        backgroundColor: ThemeVariables.transparent
    },
    modalContent: {
        borderRadius: 6,
        position: 'absolute',
        ...BASE_THEME.getStyle('elevate4').root,
        shadowRadius: 8,
        height: null
    }
} as WmPopoverStyles);