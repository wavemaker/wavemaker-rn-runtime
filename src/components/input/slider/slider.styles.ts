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
    disabled: ViewStyle,
    markerWrapper: ViewStyle,
    markerLabel: TextStyle,
    mark: ViewStyle,
    trackStyle: ViewStyle,
    markerStyle: ViewStyle,
    markerLabelStyle: TextStyle,
    minimumTrackStyle: ViewStyle,
    maximumTrackStyle: ViewStyle,
    activeTrackStyle: ViewStyle,
    tooltip: ViewStyle;
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
            height: 20,
            width: 20,
            position: 'absolute',
            left: 0,
            marginLeft: -10,
            marginTop: -20,
            borderRadius: 16,
            backgroundColor: themeVariables.thumbTintColor,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center'
        },
        disabled: {
            pointerEvents: 'none'
        },
        markerWrapper: {
            position: 'absolute',
        },
        markerLabel: {
            position: 'absolute',
            bottom: 15,
        },
        mark: {
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.2)',
            bottom: 0,
        },
        trackStyle: {},
        markerStyle: {},
        markerLabelStyle: {},
        minimumTrackStyle: {},
        maximumTrackStyle: {},
        activeTrackStyle: {},
        tooltip: {},
        tooltipLabel: {},
        tooltipTriangle: {},
    }) as WmSliderStyles;

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    
    // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
    addStyle('form-slider-input-horizontal', '', {
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