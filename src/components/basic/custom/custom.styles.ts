import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';


export type WmCustomStyles = BaseStyles & {
    skeleton: WmSkeletonStyles;
}

export const DEFAULT_CLASS = 'app-custom';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmCustomStyles>({
        root: {},
        text: {},
        skeleton: {
            root: {
              width: 96,
              height: 48,
              borderRadius: 4
            }
          } as WmSkeletonStyles
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});