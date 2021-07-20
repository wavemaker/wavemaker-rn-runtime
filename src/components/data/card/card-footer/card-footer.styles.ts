import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCardFooterStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-card-footer';
export const DEFAULT_STYLES: WmCardFooterStyles = {
    root: {
        width: '100%',
        backgroundColor: ThemeVariables.cardFooterBgColor,
        padding: 8,
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);