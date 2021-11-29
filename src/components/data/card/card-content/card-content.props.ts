import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCardContentProps extends BaseProps {
  children? = null as any;
  renderPartial?: Function;
}
