import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { SkeletonAnimationProps } from '@wavemaker/app-rn-runtime/runtime/base-fragment.component';

export default interface WmPartialProps extends SkeletonAnimationProps {
    children: any[];
}