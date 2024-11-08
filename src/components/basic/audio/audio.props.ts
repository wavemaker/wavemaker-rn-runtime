import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAudioProps extends BaseProps {
    mp3format? = '';
    controls = false;
    autoplay = false;
    loop = false;
    muted = false;
}