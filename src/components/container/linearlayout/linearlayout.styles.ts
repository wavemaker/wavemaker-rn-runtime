import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmLinearlayoutStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-linearlayout';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmLinearlayoutStyles = defineStyles({
        root: {},
        text: {},
        skeleton: {
            root: {
            }
        } as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});