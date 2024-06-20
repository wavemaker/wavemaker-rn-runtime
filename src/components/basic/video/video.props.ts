import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';
export default class WmVideoProps extends BaseProps {
    autoplay = false;
    controls = false;
    loop = false;
    mp4format: string = null as any;
    muted = false;
    oggformat: string = null as any;
    subtitlelang = 'en';
    subtitlesource: string = null as any;
    videoposter = 'resources/images/imagelists/default-image.png';
    videopreload = 'none';
    videosupportmessage = 'Your browser does not support the video tag.';
    webmformat: string = null as any;
    accessibilitylabel?: string = undefined;
    hint?: string = undefined;
    accessibilityrole?: AccessibilityRole;
}