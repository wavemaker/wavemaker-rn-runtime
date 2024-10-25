import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';

export type WmVideoStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-video';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmVideoStyles>({
        root: {
            height: 300,
            width : "100%"
        },
        text: {},
        skeleton: {
            root: {
              width: 100,
              height: 100,
              borderRadius: 8,
              backgroundColor:'#eeeeee'
            }
          } as WmSkeletonStyles
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});