import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmPageContentProps extends BaseProps {
    children: any[] = null as any;
    scrollable: boolean = true;
    onContentReady: () => any = null as any;
}