import {AccessibilityRole} from 'react-native';
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmButtonProps extends BaseProps {
    animation?: string = null as any;
    animationdelay?: number = null as any;
    caption?: string = null as any;
    badgevalue?: string = null as any;
    iconclass?: string = null as any;
    iconposition? = 'left';
    onTap?: Function = null as any;
    iconsize?:number = 0;
    skeletonheight?: string = null as any;
    skeletonwidth?: string = null as any;
    iconurl?: string = null as any;
    iconheight?: number = null as any;
    iconwidth?: number = null as any;
    iconmargin?: number = null as any;
    accessibilitylabel?: string = undefined;
    hint?: string = undefined;
    accessibilityrole?: AccessibilityRole = "button";
}
