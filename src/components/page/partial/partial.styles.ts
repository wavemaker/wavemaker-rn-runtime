import BASE_THEME, { NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmPartialStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-partial';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPartialStyles = defineStyles({
        root: {
            width: "100%"
        },
        text: {},
        skeleton: {
            root: {
                height: 200
            }
        } as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});