import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';
import { WmPictureStyles } from '../picture/picture.styles';
import { ViewStyle } from 'react-native';

export type WmVideoStyles = BaseStyles & {
    skeleton: WmSkeletonStyles;
    playIconContainer: ViewStyle;
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
                height: 300,
                width : "100%"    
            }
        } as any as WmSkeletonStyles,
        playIconContainer: {
            position: 'absolute', 
            top: 0, 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: '100%', 
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
} 
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});