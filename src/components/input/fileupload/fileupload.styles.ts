import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmFileuploadStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-fileupload';
export const DEFAULT_STYLES: WmFileuploadStyles = defineStyles({
    root: {},
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
