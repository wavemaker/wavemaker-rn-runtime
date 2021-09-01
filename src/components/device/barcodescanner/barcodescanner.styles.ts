import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmBarcodescannerStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-barcodescanner';
export const DEFAULT_STYLES: WmBarcodescannerStyles = {
    root: {},
    text: {},
    button: {} as WmButtonStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
