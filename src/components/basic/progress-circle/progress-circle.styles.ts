import Color from 'color';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmProgressCircleStyles = BaseStyles & {
    progressCircle : AllStyle,
    progressValue: AllStyle,
    subTitle: AllStyle
};

export const DEFAULT_CLASS = 'app-progress-circle';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmProgressCircleStyles = defineStyles({
        root: {},
        text: {},
        progressCircle: {},
        progressValue: {
            height: 16,
        },
        subTitle: {
            fontFamily: themeVariables.baseFont,
            fontSize: 12,
            color: themeVariables.labelTextMutedColor
        }
    } as WmProgressCircleStyles);

    const getStyle = (color: string) => ({
        progressCircle: {
            backgroundColor: Color(color).fade(0.8).rgb().toString(),
            borderColor: color,
            borderStyle: 'solid',
            borderWidth: 1
        },
        progressValue: {
            backgroundColor: color
        }
    } as WmProgressCircleStyles);

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('app-default-progress-circle', '', getStyle(themeVariables.progressCircleDefaultColor));
    addStyle('app-success-progress-circle', '', getStyle(themeVariables.progressCircleSuccessColor));
    addStyle('app-info-progress-circle', '', getStyle(themeVariables.progressCircleInfoColor));
    addStyle('app-danger-progress-circle', '', getStyle(themeVariables.progressCircleDangerColor));
    addStyle('app-warning-progress-circle', '', getStyle(themeVariables.progressCircleWarningColor));
    addStyle('app-progress-circle1', '', {
        progressCircle: {
            backgroundColor: themeVariables.transparent
        },
        progressValue: {
            height: 8,
            //@ts-ignore
            buttStyle: 'round'
        }
    });
    addStyle('app-progress-circle2', '', {
        progressCircle: {
            backgroundColor: themeVariables.defaultColorE
        },
        progressValue: {
            height: 8,
            //@ts-ignore
            buttStyle: 'round'
        }
    });
    addStyle('app-progress-circle3', '', {
        root: {
            transform: [{rotateY: '180deg'}]
        },
        text: {
            transform: [{rotateY: '180deg'}]
        },
        subTitle: {
            transform: [{rotateY: '180deg'}]
        },
        progressCircle: {
            backgroundColor: themeVariables.defaultColorE
        },
        progressValue: {
            height: 8,
            //@ts-ignore
            buttStyle: 'round'
        }
    });
});