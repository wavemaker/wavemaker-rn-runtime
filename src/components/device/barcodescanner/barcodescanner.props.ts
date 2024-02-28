import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';

export default class WmBarcodescannerProps extends BaseProps {
  barcodeformat: string = 'ALL';
  caption: string = null as any;
  datavalue: any;
  iconclass: string = 'fa fa-barcode';
  iconsize: number = 16;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = "imagebutton";
}
