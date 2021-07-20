import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmMessageProps extends BaseProps {
  caption? = 'Message';
  type?: 'success' | 'warning' | 'error' | 'info' | 'loading' = 'success';
  hideclose? = false;
}