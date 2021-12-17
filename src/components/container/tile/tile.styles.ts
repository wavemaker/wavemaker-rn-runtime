import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmTileStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tile';
export const DEFAULT_STYLES: WmTileStyles = {
    root: {
      borderRadius: 8,
      padding: 12
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getTileBgStyles = (color: string) => {
  return {
    root: {
      backgroundColor: color
    }
  } as WmTileStyles;
};

BASE_THEME.addStyle('tile-template-text', '', {
  text: {
    color: ThemeVariables.tilePrimaryTextColor
  }
} as any);

BASE_THEME.addStyle('bg-danger', '', getTileBgStyles(ThemeVariables.tileDangerColor));
BASE_THEME.addStyle('bg-info', '', getTileBgStyles(ThemeVariables.tileInfoColor));
BASE_THEME.addStyle('bg-primary', '', getTileBgStyles(ThemeVariables.tilePrimaryColor));
BASE_THEME.addStyle('bg-success', '', getTileBgStyles(ThemeVariables.tileSuccessColor));
BASE_THEME.addStyle('bg-warning', '', getTileBgStyles(ThemeVariables.tileWarningColor));
BASE_THEME.addStyle('well', '', {
  root: {
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: ThemeVariables.tileWellbgColor,
    borderColor: ThemeVariables.tileWellBorderColor,
    borderStyle: 'solid',
    borderRadius: 2
  }
});
