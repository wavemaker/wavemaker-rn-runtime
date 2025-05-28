import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmContainerStyles } from '@wavemaker/app-rn-runtime/components/container/container.styles';
import { Dimensions } from 'react-native';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmPopoverStyles = BaseStyles & {
    link: WmAnchorStyles,
    popover: AllStyle,
    popoverContent : WmContainerStyles,
    modal: AllStyle,
    modalContent: AllStyle,
    title: AllStyle,
    draghandleicon:WmIconStyles
};

export const DEFAULT_CLASS = 'app-popover';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPopoverStyles = defineStyles({
        root: {
            padding: 8,
            alignSelf: 'flex-start'
        },
        text: {},
        title: {
            backgroundColor: themeVariables.popoverTitleBackgroundColor,
            padding: 12,
            color: themeVariables.popoverTitleColor,
            fontSize: 16,
            fontFamily: themeVariables.baseFont
        },
        link: {
            root:{
            },
            text:{
                paddingRight: 8
            }
        } as WmAnchorStyles,
        popover: {
            backgroundColor: themeVariables.popoverBackgroundColor,
            maxWidth: 640,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28        
        },
        popoverContent : {
            root: {
                flex: 1
            }
        } as WmContainerStyles,
        modal: {},
        modalContent: {
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28
        },
        draghandleicon : {
            root: {alignSelf:'center',},
            text: {
            fontSize: 32
            },
            icon : {
                color: 'var(--wm-color-surface-variant-black)',
                padding: 0,
                opacity:0.4
            }
            } as WmIconStyles,
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('app-popover-action-sheet', '', {
        modal: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        popover: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            minHeight: 240,
            elevation: 4,
            maxHeight: Dimensions.get('window').height - 120
        },
        modalContent: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            ...BASE_THEME.getStyle('elevate1').root,
            shadowOffset: {
                width: 0,
                height: 0
            },
            shadowOpacity: 0.6,
            shadowRadius: 10,
            justifyContent: 'flex-end'
        }
    } as any as WmPopoverStyles);
    addStyle('popover-dropdown', '', {
        modal: {
            backgroundColor: 'transparent',
        },
        popover: {
            backgroundColor: themeVariables.transparent
        },
        modalContent: {
            borderRadius: 6,
            position: 'absolute',
            ...BASE_THEME.getStyle('elevate4').root,
            shadowRadius: 8
        }
    } as WmPopoverStyles);
});