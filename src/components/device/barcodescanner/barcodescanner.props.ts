import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmBarcodescannerProps extends BaseProps {
  barcodeformat: string = 'ALL';
  caption: string = null as any;
  datavalue: any;
  iconclass: string = 'fa fa-barcode';
  iconsize: number = 16;
}
