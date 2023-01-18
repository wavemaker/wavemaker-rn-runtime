import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmIconStyles = BaseStyles & {
    icon?: AllStyle
};
export const DEFAULT_CLASS = 'app-icon';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmIconStyles = defineStyles({
        root: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'center'
        },
        icon: {
            paddingLeft: 0
        },
        text: {
            paddingLeft: 8
        }
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});
