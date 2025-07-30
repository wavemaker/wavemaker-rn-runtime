import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmRatingStyles = BaseStyles & {
    icon: WmIconStyles,
    selectedIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-rating';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmRatingStyles = defineStyles({
        root: {
            flexDirection: 'row',
            alignContent: 'center',
            padding: 8
        },
        icon: {
            text: {
                fontSize: 32,
                color: themeVariables.ratingIconColor
            }
        } as WmIconStyles,
        selectedIcon: {
            text: {
                fontSize: 32,
                color: themeVariables.ratingSelectedIconColor
            }
        } as WmIconStyles,
        text: {
            alignSelf: 'center',
            paddingLeft: 8,
            color: themeVariables.ratingSelectedIconColor
        }
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    
    // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
    addStyle('form-rating-input-horizontal', '', {
      root: {
        flex: 1, // Take remaining space after label
        minWidth: 0, // Allow shrinking below intrinsic content size if needed
        maxWidth: '100%' // Prevent overflow
      },
      text: {}
    } as BaseStyles);
    
    addStyle(DEFAULT_CLASS + '-disabled', '', {
        root : {
        opacity: 0.5
        }
    });
});