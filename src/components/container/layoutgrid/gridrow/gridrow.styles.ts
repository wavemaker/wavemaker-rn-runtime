import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmGridRowStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-gridrow';
export const DEFAULT_STYLES: WmGridRowStyles = {
    root: {
        flexDirection: 'row'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('table-row', DEFAULT_CLASS, {
    root: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: ThemeVariables.gridColumnBorderColor
    }
});
BASE_THEME.addStyle('table-header-row', DEFAULT_CLASS, {
    root: {
        backgroundColor: ThemeVariables.layoutGridHeaderBgColor
    }
});
BASE_THEME.addStyle('table-striped-row0', DEFAULT_CLASS, {
  root: {
    backgroundColor: ThemeVariables.layoutGridStripColor1
  }
});
BASE_THEME.addStyle('table-striped-row1', DEFAULT_CLASS, {
  root: {
    backgroundColor: ThemeVariables.layoutGridStripColor2
  }
});