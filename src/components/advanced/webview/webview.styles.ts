import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WebviewStyles = BaseStyles & {
  container: AllStyle;
  webview: AllStyle;
}

export const DEFAULT_CLASS = 'app-webview';

BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WebviewStyles = defineStyles({
      root: {},
      text: {},
      container : {
        flex: 1,
        minHeight: 100
      },
      webview: {
        flex: 1
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});