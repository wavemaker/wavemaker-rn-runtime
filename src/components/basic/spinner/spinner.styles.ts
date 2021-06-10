import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME, { NamedStyles }  from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmSpinnerStyles = BaseStyles & {
  icon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-spinner';
export const DEFAULT_STYLES: WmSpinnerStyles = {
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    paddingLeft: 8
  },
  icon: {
    text: {
      fontSize: 48,
      color: ThemeVariables.spinnerIconColor
    }
  } as WmIconStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
