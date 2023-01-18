import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmListTemplateStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-list-template';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmListTemplateStyles = defineStyles<WmListTemplateStyles>({
        root: {
            flex: 1
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('list-card-template', '', {
        root : {
            borderBottomWidth: 0
        }
    } as WmListTemplateStyles);
});