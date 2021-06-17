import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { WmDatetimeStyles, DEFAULT_STYLES as DATE_TIME_DEFAUlT_STYLES } from '../datetime/datetime.styles';

export type WmTimeStyles = WmDatetimeStyles;

export const DEFAULT_CLASS = 'app-date';
export const DEFAULT_STYLES = DATE_TIME_DEFAUlT_STYLES as WmTimeStyles;

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);