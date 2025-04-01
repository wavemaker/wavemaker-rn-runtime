import BASE_THEME, { NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';

import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';
import { Dimensions } from 'react-native';

export type WmPageStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-page';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPageStyles = defineStyles({
        root: {
            flexDirection: 'column',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute'
        },
        text: {},
        skeleton: {
            root: {
                height: Dimensions.get('window').height
            }
        } as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});