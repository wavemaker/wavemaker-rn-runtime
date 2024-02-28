import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';
export default class WmAnchorProps extends BaseProps {
    animation?: string = null as any;
    caption? = 'Link';
    hyperlink?: string = null as any;
    encodeurl?: boolean = false;
    badgevalue?: string = null as any;
    width?: string = null as any;
    height?: string = null as any;
    iconclass?: string = null as any;
    iconposition?: string = 'left';
    target?: string = '_blank';
    onTap?: any;
    skeletonwidth?: number;
    skeletonheight?: number;
    iconurl?: string = null as any;
    iconheight?: number = null as any;
    iconwidth?: number = null as any;
    iconmargin?: number = null as any;
    accessibilitylabel?: string = undefined;
    hint?: string = undefined;
    accessibilityrole?: AccessibilityRole = 'link';
}
