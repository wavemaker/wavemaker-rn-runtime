import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmRatingStyles = BaseStyles & {
    icon: WmIconStyles,
    selectedIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-rating';
export const DEFAULT_STYLES: WmRatingStyles = defineStyles({
    root: {
        flexDirection: 'row',
        alignContent: 'center',
        padding: 8
    },
    icon: {
        text: {
            fontSize: 32,
            color: ThemeVariables.ratingIconColor
        }
    } as WmIconStyles,
    selectedIcon: {
        text: {
            fontSize: 32,
            color: ThemeVariables.ratingSelectedIconColor
        }
    } as WmIconStyles,
    text: {
        alignSelf: 'center',
        paddingLeft: 8,
        color: ThemeVariables.ratingSelectedIconColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);