import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';

export type WmPrefabContainerStyles =  BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-prefab';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPrefabContainerStyles = defineStyles({
        root: {},
        text: {},
        skeleton: {
            root: {
                height: 200
            }
        } as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});