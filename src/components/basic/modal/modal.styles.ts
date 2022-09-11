import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';


export type WmModalStyles = BaseStyles & {
    content: AllStyle,
};

export const DEFAULT_CLASS = 'app-modal';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmModalStyles = defineStyles({
        root: {
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        text: {},
        content: {
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
        }
    });

    addStyle('centered-modal', '', {
        root: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: 'center',
        },
        text: {},
        content: {
            alignSelf: 'center'
        }
    } as WmModalStyles);


    addStyle(DEFAULT_CLASS, '', defaultStyles);
});