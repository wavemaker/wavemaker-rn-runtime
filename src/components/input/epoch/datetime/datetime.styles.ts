import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmDatetimeStyles = BaseStyles & {
    focused: AllStyle,
    container: AllStyle,
    clearIcon: WmIconStyles,
    calendarIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-datetime';
export const DEFAULT_STYLES: WmDatetimeStyles = defineStyles({
    root: {
        height: 38,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        backgroundColor: ThemeVariables.inputBackgroundColor,
        borderColor: ThemeVariables.inputBorderColor,
        padding: 8,
        justifyContent: 'center',
        width: '100%'
    },
    focused: {
        
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        flex: 1,
        color: ThemeVariables.inputTextColor
    },
    calendarIcon: {
        root: {
            alignSelf: 'center'
        }
    },
    clearIcon:  {
        root : {
            alignSelf: 'center',
            paddingLeft: 8,
            paddingRight: 8
        }
    } as WmIconStyles
}) as WmDatetimeStyles;

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);