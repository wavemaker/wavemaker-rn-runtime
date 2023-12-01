import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';

export default class WmCameraProps extends BaseProps {
  allowedit: boolean = false;
  capturetype: string = 'IMAGE';
  iconclass: string = 'wm-sl-l sl-camera';
  iconsize: number = 16;
  imagequality: number = 80;
  imageencodingtype: string = 'JPEG';
  imagetargetwidth: number = null as any;
  imagetargetheight: number = null as any;
  datavalue: any;
  localFilePath: string = '';
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = "imagebutton";
}
