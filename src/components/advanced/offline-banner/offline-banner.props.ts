import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmOfflineBannerProps extends BaseProps {
  onRetry: () => void = null as any;
  message?: string = 'No Internet Connection';
}
