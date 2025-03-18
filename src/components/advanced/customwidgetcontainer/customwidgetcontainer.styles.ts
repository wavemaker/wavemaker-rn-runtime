import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmCustomWidgetContainerStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-CustomWidgetContainer';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmCustomWidgetContainerStyles>({
        root: {},
        text: {},
        skeleton: {
            root: {
            }
        } as WmSkeletonStyles
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});