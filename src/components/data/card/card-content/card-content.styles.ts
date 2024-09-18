import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmCardContentStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-card-content';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCardContentStyles = defineStyles({
        root: {
            backgroundColor: themeVariables.cardContentBgColor,
            padding: 8
        },
        text: {},
        skeleton: {
            root: {
            }
        } as any as WmSkeletonStyles
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});