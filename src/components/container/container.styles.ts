import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

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