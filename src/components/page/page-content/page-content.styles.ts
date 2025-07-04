import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { Dimensions, StatusBar } from 'react-native';

export type WmPageContentStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-page-content';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPageContentStyles = defineStyles({
        root: {
            padding: 8,
            backgroundColor: themeVariables.pageContentBgColor,
            minHeight: '100%'
        },
        text: {},
        skeleton: {
            root: {
                height: themeVariables.maxModalHeight
            }
        } as any as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});