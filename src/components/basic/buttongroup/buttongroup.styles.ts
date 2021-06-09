import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmButtongroupStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-buttongroup';
export const DEFAULT_STYLES: WmButtongroupStyles = {
    root: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
