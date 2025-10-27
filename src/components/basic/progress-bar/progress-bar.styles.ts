import Color from 'color';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Platform } from 'react-native';

export type WmProgressBarStyles = BaseStyles & {
    progressBar: AllStyle,
    progressValue: AllStyle,
    tooltip: AllStyle,
    tooltipLabel: AllStyle,
    tooltipTriangle: AllStyle
};

export const DEFAULT_CLASS = 'app-progress-bar';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmProgressBarStyles = defineStyles({
        root: {},
        text: {},
        progressBar: {
            height: 4
        },
        progressValue: {},
        tooltip: {
            backgroundColor: themeVariables.tooltipBgColor,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4
        },
        tooltipLabel: {
            color: themeVariables.defaultColor,
            fontSize: 12
        },
        tooltipTriangle: {
            borderBottomColor: themeVariables.tooltipBgColor
        }
    });

    const getStyle = (color: string) => ({
        progressBar: {
            backgroundColor: Color(color).alpha(0.2).rgb().toString()
        },
        progressValue: {
            color: color
        },
        tooltip: {},
        tooltipLabel: {},
        tooltipTriangle: {}
    } as WmProgressBarStyles);

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('app-default-progress-bar', '', getStyle(themeVariables.progressBarDefaultColor));
    addStyle('app-success-progress-bar', '', getStyle(themeVariables.progressBarSuccessColor));
    addStyle('app-info-progress-bar', '', getStyle(themeVariables.progressBarInfoColor));
    addStyle('app-danger-progress-bar', '', getStyle(themeVariables.progressBarDangerColor));
    addStyle('app-warning-progress-bar', '', getStyle(themeVariables.progressBarWarningColor));
    addStyle('vertical', '', {
        root: {},
        progressBar: {
            width: 4,
            height: 100
        }
    } as WmProgressBarStyles);
});