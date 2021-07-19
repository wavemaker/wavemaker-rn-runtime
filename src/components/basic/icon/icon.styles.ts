import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmIconStyles = BaseStyles & {
    icon?: AllStyle
};
export const DEFAULT_CLASS = 'app-icon';
export const DEFAULT_STYLES: WmIconStyles = {
    root: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    icon: {
        paddingLeft: 0
    },
    text: {
        paddingLeft: 8
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
