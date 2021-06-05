import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';


export type WmModalStyles = BaseStyles & {
    content: AllStyle,
};

export const DEFAULT_CLASS = 'app-modal';
export const DEFAULT_STYLES: WmModalStyles = {
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0)',
        alignSelf: 'center',
    },
    text: {},
    content: {
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
        alignSelf: 'center'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);