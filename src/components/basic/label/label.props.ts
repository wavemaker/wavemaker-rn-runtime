import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmLabelProps extends BaseProps {
    animation?: string = null as any;
    caption?: string = 'Label';
    required?: boolean = null as any;
    isValid?: boolean = true;
    wrap?: boolean = true;
    skeletonheight?: string = null as any;
    skeletonwidth?: string = null as any;
    multilineskeleton?: boolean = false;
    nooflines?: any = undefined;
}
