import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { ViewStyle } from 'react-native';

export type WmSliderStyles = BaseStyles & {
    minimumTrack: ViewStyle,
    maximumTrack: ViewStyle,
    thumb: ViewStyle,
    disabled: ViewStyle
};

export const DEFAULT_CLASS = 'app-slider';
export const DEFAULT_STYLES: WmSliderStyles = defineStyles({
    root: {},
    text: {},
    minimumTrack: {
        backgroundColor: ThemeVariables.minimumTrackTintColor
    },
    maximumTrack: {
        backgroundColor: ThemeVariables.maximumTrackTintColor
    },
    thumb: {
        backgroundColor: ThemeVariables.thumbTintColor
    },
    disabled: {
        pointerEvents: 'none'
    }
}) as WmSliderStyles;

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);