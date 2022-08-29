import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmContainerStyles = BaseStyles & {
    content: AllStyle
};

export const DEFAULT_CLASS = 'app-container';
export const DEFAULT_STYLES: WmContainerStyles = defineStyles({
    root: {},
    text: {},
    content: {
        flexDirection: 'column'
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('media-body', '', {
    root: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        justifyContent: 'center'
    }
} as WmContainerStyles);
BASE_THEME.addStyle('media-right', '', {
    root: {
        justifyContent: 'center'
    }
} as WmContainerStyles);
BASE_THEME.addStyle('app-elevated-container', '', {
    root: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        borderRadius: 8
    }
} as WmContainerStyles);
BASE_THEME.addStyle('app-outlined-container', '', {
    root: {
        borderWidth: 1,
        borderColor: ThemeVariables.containerOutlineColor,
        borderStyle: 'solid'
    }
} as WmContainerStyles);