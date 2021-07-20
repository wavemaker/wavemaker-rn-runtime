import Color from 'color';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmProgressBarStyles = BaseStyles & {
    progressBar : AllStyle,
    progressValue: AllStyle
};

export const DEFAULT_CLASS = 'app-progress-bar';
export const DEFAULT_STYLES: WmProgressBarStyles = {
    root: {},
    text: {},
    progressBar: {
        backgroundColor: Color(ThemeVariables.progressBarDefaultColor).lighten(0.7).rgb().toString(),
        height: 16
    },
    progressValue: {
        color: ThemeVariables.progressBarDefaultColor
    }
};

const getStyle = (color: string) => ({
    progressBar: {
        backgroundColor: Color(color).lighten(0.6).rgb().toString()
    },
    progressValue: {
        color: color
    }
} as WmProgressBarStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('app-default-progress-bar', DEFAULT_CLASS, getStyle(ThemeVariables.progressBarDefaultColor));
BASE_THEME.addStyle('app-success-progress-bar', DEFAULT_CLASS, getStyle(ThemeVariables.progressBarSuccessColor));
BASE_THEME.addStyle('app-info-progress-bar', DEFAULT_CLASS, getStyle(ThemeVariables.progressBarInfoColor));
BASE_THEME.addStyle('app-danger-progress-bar', DEFAULT_CLASS, getStyle(ThemeVariables.progressBarDangerColor));
BASE_THEME.addStyle('app-warning-progress-bar', DEFAULT_CLASS, getStyle(ThemeVariables.progressBarWarningColor));