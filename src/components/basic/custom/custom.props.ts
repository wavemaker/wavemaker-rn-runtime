import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCustomProps extends BaseProps {
    renderview:Function = () => {return null};
    children? = null as any;
    skeletonheight?: string = null as any;
    skeletonwidth?: string = null as any;
}