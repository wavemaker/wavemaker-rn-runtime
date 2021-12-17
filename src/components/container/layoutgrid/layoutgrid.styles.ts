import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';

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

BASE_THEME.addStyle('table', '', {
  root: {
    backgroundColor: ThemeVariables.layoutGridBgColor,
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.layoutGridBorderColor,
    borderRadius: 2
  }
});

BASE_THEME.addStyle('table-header-label', '', {
    text: {
      color: ThemeVariables.layoutGridHeaderTextColor,
      fontWeight: 'bold'
    }
} as WmLabelStyles);
