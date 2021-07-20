import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLayoutGridStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-layoutgrid';
export const DEFAULT_STYLES: WmLayoutGridStyles = {
    root: {
      flexDirection: 'column',
      width: '100%'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

BASE_THEME.addStyle('bordered', DEFAULT_CLASS, {
  root: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.layoutGridBorderColor
  }
});
