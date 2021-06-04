import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmContainerProps extends BaseProps {
  children?: any;
  renderPartial?: Function;
  isPartialLoaded = false;
}