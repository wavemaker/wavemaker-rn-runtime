import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmOfflineBannerProps extends BaseProps {
  /** Custom message to show */
  message?: string = 'No Internet Connection';
}