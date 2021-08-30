import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmContainerProps extends BaseProps {
  animation?: string = null as any;
  children?: any;
  renderPartial?: Function;
  onLoad?: Function;
}
