import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WebviewStyles = BaseStyles & {
  container: AllStyle;
  webview: AllStyle;
}

export const DEFAULT_CLASS = 'app-webview';
export const DEFAULT_STYLES: WebviewStyles = {
    root: {},
    text: {},
    container : {
      flex: 1,
      minHeight: 100
    },
    webview: {
      flex: 1
    }
};

BASE_THEME.addStyle<WebviewStyles>(DEFAULT_CLASS, '', DEFAULT_STYLES);