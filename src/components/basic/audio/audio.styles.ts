import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSliderStyles } from '../../input/slider/slider.styles';
import { WmIconStyles } from '../icon/icon.styles';
import Color from 'color';

export type WmAudioStyles = BaseStyles & {
    playIcon: WmIconStyles
    pauseIcon: WmIconStyles
    muteIcon: WmIconStyles
    unmuteIcon: WmIconStyles
    slider: WmSliderStyles
};

export const DEFAULT_CLASS = 'app-audio';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmAudioStyles>({
        root: {
            backgroundColor: themeVariables.defaultColorF,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 64,
            minWidth: 300
        },
        text: {
            color: themeVariables.defaultColor3,
            paddingHorizontal: 8
        },
        playIcon: {
            icon: {
                color: themeVariables.defaultColor3
            }
        },
        pauseIcon: {
            icon: {
                color: themeVariables.defaultColor3
            }
        },
        muteIcon: {
            icon: {
                color: themeVariables.defaultColor3
            }
        },
        unmuteIcon: {
            icon: {
                color: themeVariables.defaultColor3
            }
        },
        slider: {
            root: {
                flex: 1
            },
            text: {
                display: 'none'
            },
            minimumTrack: {
                backgroundColor: themeVariables.defaultColor3
            },
            maximumTrack: {
                backgroundColor: Color(themeVariables.defaultColor3).lighten(0.8).rgb().toString()
            },
            thumb: {
                backgroundColor: themeVariables.defaultColor3
            }
        } as WmSliderStyles
    } as WmAudioStyles);
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});