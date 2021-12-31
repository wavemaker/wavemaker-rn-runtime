import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmTileStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tile';
export const DEFAULT_STYLES: WmTileStyles = defineStyles({
    root: {
      borderRadius: 6,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.transparent,
      padding: 12
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

BASE_THEME.addStyle('tile-template-text', '', {
  text: {
    color: ThemeVariables.tilePrimaryTextColor
  }
} as any);

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
