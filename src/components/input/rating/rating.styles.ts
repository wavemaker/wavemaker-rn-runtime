import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmRatingStyles = BaseStyles & {
    icon: WmIconStyles,
    selectedIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-rating';
export const DEFAULT_STYLES: WmRatingStyles = {
    root: {
        flexDirection: 'row'
    },
    icon: {
        text: {
            fontSize: 16,
            color: ThemeVariables.ratingIconColor
        }
    } as WmIconStyles,
    selectedIcon: {
        text: {
            fontSize: 16,
            color: ThemeVariables.ratingSelectedIconColor
        }
    } as WmIconStyles,
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);