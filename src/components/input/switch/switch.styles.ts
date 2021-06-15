import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmSwitchStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-switch';
export const DEFAULT_STYLES: WmSwitchStyles = {
    root: {
      height: 'auto',
      width: '100%'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
