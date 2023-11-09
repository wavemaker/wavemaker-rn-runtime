import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';

export type WmSliderStyles = BaseStyles & {
    minimumValue: TextStyle,
    maximumValue: TextStyle,
    value: TextStyle,
    track: ViewStyle,
    minimumTrack: ViewStyle,
    maximumTrack: ViewStyle,
    thumb: ViewStyle,
    disabled: ViewStyle
};

export const DEFAULT_CLASS = 'app-slider';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmSliderStyles = defineStyles({
        root: {
        },
        text: {
            fontSize: 16
        },
        minimumValue: {

        },
        maximumValue: {

        },
        value: {

        },
        track: {
            position: 'relative',
            height: 4,
            flexDirection: 'row',
            width: '100%',
            minWidth: 160,
            marginVertical: 8,
            overflow: 'hidden',
            borderRadius: 4
        },
        minimumTrack: {
            position: 'absolute',
            height: '100%',
            width:  150,
            backgroundColor: themeVariables.minimumTrackTintColor,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
        },
        maximumTrack: {
            position: 'absolute',
            height: '100%',
            backgroundColor: themeVariables.maximumTrackTintColor,
            flex: 1,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
        },
        thumb: {
            height: 16,
            width: 16,
            marginLeft: -8,
            marginTop: -18,
            borderRadius: 16,
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