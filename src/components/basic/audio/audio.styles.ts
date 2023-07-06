import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSliderStyles } from '../../input/slider/slider.styles';
import { WmIconStyles } from '../icon/icon.styles';

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
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 64,
            minWidth: 300
        },
        text: {
            color: '#333',
            paddingHorizontal: 8
        },
        playIcon: {
            icon: {
                color: '#333'
            }
        },
        pauseIcon: {
            icon: {
                color: '#333'
            }
        },
        muteIcon: {
            icon: {
                color: '#333'
            }
        },
        unmuteIcon: {
            icon: {
                color: '#333'
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
                backgroundColor: '#333'
            },
            maximumTrack: {
                backgroundColor: '#ddd'
            },
            thumb: {
                backgroundColor: '#333'
            }
        } as WmSliderStyles
    } as WmAudioStyles);
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});