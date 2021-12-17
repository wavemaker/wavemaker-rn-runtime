import Color from 'color';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmProgressCircleStyles = BaseStyles & {
    progressCircle : AllStyle,
    progressValue: AllStyle,
    subTitle: AllStyle
};

export const DEFAULT_CLASS = 'app-progress-circle';
export const DEFAULT_STYLES: WmProgressCircleStyles = {
    root: {},
    text: {},
    progressCircle: {},
    progressValue: {
        height: 16
    },
    subTitle: {
        fontSize: 12,
        color: ThemeVariables.labelTextMutedColor
    }
};

const getStyle = (color: string) => ({
    progressCircle: {
        backgroundColor: Color(color).fade(0.8).rgb().toString(),
    },
    progressValue: {
        backgroundColor: color
    }
} as WmProgressCircleStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('app-default-progress-circle', '', getStyle(ThemeVariables.progressCircleDefaultColor));
BASE_THEME.addStyle('app-success-progress-circle', '', getStyle(ThemeVariables.progressCircleSuccessColor));
BASE_THEME.addStyle('app-info-progress-circle', '', getStyle(ThemeVariables.progressCircleInfoColor));
BASE_THEME.addStyle('app-danger-progress-circle', '', getStyle(ThemeVariables.progressCircleDangerColor));
BASE_THEME.addStyle('app-warning-progress-circle', '', getStyle(ThemeVariables.progressCircleWarningColor));