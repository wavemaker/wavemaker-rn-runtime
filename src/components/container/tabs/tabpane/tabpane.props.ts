import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmTabpaneProps extends BaseProps {
  children: any;
  paneicon: string = null as any;
  title: string = 'Tab Title';
  renderPartial?: Function;
  isPartialLoaded = false;
}
