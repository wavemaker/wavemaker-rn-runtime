import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmDateStyles = BaseStyles & {
    focused: AllStyle,
    container: AllStyle,
    clearIcon: WmIconStyles,
    calendarIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-date';
export const DEFAULT_STYLES: WmDateStyles = {
    root: {
        borderColor: ThemeVariables.inputBorderColor,
        borderBottomWidth: 1,
        padding: 8,
        width: '100%'
    },
    focused: {
        borderColor: ThemeVariables.primaryColor
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        flex: 1,
        color: ThemeVariables.inputTextColor
    },
    clearIcon:  {
        root : {
            paddingLeft: 8,
            paddingRight: 8
        }
    } as WmIconStyles
} as WmDateStyles;

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);