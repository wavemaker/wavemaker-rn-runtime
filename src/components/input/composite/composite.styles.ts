import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCompositeStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-composite';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCompositeStyles = defineStyles({
        root: {
            flexDirection: 'row',
            alignItems: 'flex-start'
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('app-composite-left-caption', DEFAULT_CLASS,  {
        root: {
            flexDirection: 'row'
        }
    } as WmCompositeStyles);
    addStyle('app-composite-right-caption', DEFAULT_CLASS,  {
        root: {
            flexDirection: 'row-reverse'
        }
    } as WmCompositeStyles);
    addStyle('app-composite-top-caption', DEFAULT_CLASS, {
        root: {
            flexDirection: 'column'
        }
    } as WmCompositeStyles);
});