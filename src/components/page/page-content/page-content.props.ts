import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { SkeletonAnimationProps } from '@wavemaker/app-rn-runtime/runtime/base-fragment.component';

export default class WmPageContentProps extends SkeletonAnimationProps {
    children: any[] = null as any;
    scrollable: boolean = true;
    keyboardverticaloffset: number = 100;
}