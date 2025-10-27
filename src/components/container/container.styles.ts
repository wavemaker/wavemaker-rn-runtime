import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';

export type WmContainerStyles = BaseStyles & {
    content: AllStyle,
    skeleton: WmSkeletonStyles,
    sticky: AllStyle
};

export const DEFAULT_CLASS = 'app-container';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmContainerStyles = defineStyles({
        root: {},
        text: {},
        content: {
            flexDirection: 'column'
        },
        skeleton: {
            root: {
                borderColor: 'transparent',
                shadowColor: 'transparent',
                backgroundColor: 'transparent',
            },
        } as any as WmSkeletonStyles, 
        sticky: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('media-body', '', {
        root: {
            flex: 1,
            paddingLeft: 8,
            paddingRight: 8,
            justifyContent: 'center'
        }
    } as WmContainerStyles);
    addStyle('media-right', '', {
        root: {
            justifyContent: 'center'
        }
    } as WmContainerStyles);
    addStyle('app-elevated-container', '', {
        root: {
            boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.2)',
            borderRadius: 8
        }
    } as WmContainerStyles);
    addStyle('app-outlined-container', '', {
        root: {
            borderWidth: 1,
            borderColor: themeVariables.containerOutlineColor,
            borderStyle: 'solid'
        }
    } as WmContainerStyles);
});