import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmWizardstepStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-wizardstep';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmWizardstepStyles = defineStyles({
        root: {
            height: '100%'
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});
