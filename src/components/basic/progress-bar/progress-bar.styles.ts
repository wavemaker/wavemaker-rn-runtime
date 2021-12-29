import Color from 'color';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmProgressBarStyles = BaseStyles & {
    progressBar : AllStyle,
    progressValue: AllStyle
};

export const DEFAULT_CLASS = 'app-progress-bar';
export const DEFAULT_STYLES: WmProgressBarStyles = defineStyles({
    root: {},
    text: {},
    progressBar: {
        height: 4
    },
    progressValue: {}
});

const getStyle = (color: string) => ({
    progressBar: {
        backgroundColor: Color(color).fade(0.6).rgb().toString()
    },
    progressValue: {
        color: color
    }
} as WmProgressBarStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('app-default-progress-bar', '', getStyle(ThemeVariables.progressBarDefaultColor));
BASE_THEME.addStyle('app-success-progress-bar', '', getStyle(ThemeVariables.progressBarSuccessColor));
BASE_THEME.addStyle('app-info-progress-bar', '', getStyle(ThemeVariables.progressBarInfoColor));
BASE_THEME.addStyle('app-danger-progress-bar', '', getStyle(ThemeVariables.progressBarDangerColor));
BASE_THEME.addStyle('app-warning-progress-bar', '', getStyle(ThemeVariables.progressBarWarningColor));