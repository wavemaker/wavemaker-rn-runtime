import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmDatetimeStyles, DEFAULT_STYLES as DATE_TIME_DEFAUlT_STYLES } from '../datetime/datetime.styles';

export type WmDateStyles = WmDatetimeStyles;

export const DEFAULT_CLASS = 'app-date';
export const DEFAULT_STYLES = DATE_TIME_DEFAUlT_STYLES as WmDateStyles;

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      backgroundColor: ThemeVariables.inputDisabledBgColor
    }
});