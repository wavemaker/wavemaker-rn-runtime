import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';

export type WmSliderStyles = BaseStyles & {
    minimumValue: TextStyle,
    maximumValue: TextStyle,
    value: TextStyle,
    minimumTrack: ViewStyle,
    maximumTrack: ViewStyle,
    thumb: ViewStyle,
    disabled: ViewStyle
};

export const DEFAULT_CLASS = 'app-slider';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmSliderStyles = defineStyles({
        root: {},
        text: {
            fontSize: 16
        },
        minimumValue: {

        },
        maximumValue: {

        },
        value: {

        },
        minimumTrack: {
            backgroundColor: themeVariables.minimumTrackTintColor
        },
        maximumTrack: {
            backgroundColor: themeVariables.maximumTrackTintColor
        },
        thumb: {
            backgroundColor: themeVariables.thumbTintColor
        },
        disabled: {
            pointerEvents: 'none'
        }
    }) as WmSliderStyles;

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle(DEFAULT_CLASS + '-disabled', '', {
        root : {
        opacity: 0.5
        }
    });
});