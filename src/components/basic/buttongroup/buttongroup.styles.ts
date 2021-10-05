import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '../button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmButtongroupStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-buttongroup';
export const DEFAULT_STYLES: WmButtongroupStyles = {
    root: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      borderRadius: 100,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.buttonGrpBorderColor,
      backgroundColor: ThemeVariables.buttonGrpBgColor
    },
    text: {}
};


BASE_THEME.addStyle('btn-group-child', '', {
  root: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    flex: 1,
    borderColor: ThemeVariables.buttonGrpBorderColor
  }
} as WmButtonStyles);
BASE_THEME.addStyle('btn-group-first-child', '', {
  root: {
    borderLeftWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderColor: ThemeVariables.buttonGrpBorderColor
  }
} as WmButtonStyles);
BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
