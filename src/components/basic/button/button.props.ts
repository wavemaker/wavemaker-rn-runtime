import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmButtonProps extends BaseProps {
    animation?: string = null as any;
    caption?: string = null as any;
    badgevalue?: string = null as any;
    iconclass?: string = null as any;
    iconposition? = 'left';
    onTap?: Function = null as any;
    iconsize?:number = 0;
}
