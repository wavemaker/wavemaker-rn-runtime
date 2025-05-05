import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';
export default class WmLabelProps extends BaseProps {
    animation?: string = null as any;
    animationdelay?: number = null as any;
    caption?: string = 'Label';
    required?: boolean = null as any;
    isValid?: boolean = true;
    wrap?: boolean = true;
    nooflines?: any = undefined;
    skeletonheight?: string = null as any;
    skeletonwidth?: string = null as any;
    multilineskeleton?: boolean = false;
    accessibilitylabel?: string = undefined;
    hint?: string = undefined;
    accessibilityrole?: AccessibilityRole = 'text';
    onTap?: Function = null as any;
    ellipsisenabledforandroid?: boolean = true;
}
