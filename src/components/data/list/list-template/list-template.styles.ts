import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmListTemplateStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-list-template';
export const DEFAULT_STYLES: WmListTemplateStyles = defineStyles({
    root: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: ThemeVariables.listDividerColor,
        borderStyle: 'solid'
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('list-card-template', '', {
    root : {
        borderBottomWidth: 0
    }
} as WmListTemplateStyles);