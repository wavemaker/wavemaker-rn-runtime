import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default interface WmPartialProps extends BaseProps {
    children: any[];
    onContentReady: () => any;
}