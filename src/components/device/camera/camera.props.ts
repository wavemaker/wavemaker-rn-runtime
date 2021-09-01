import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCameraProps extends BaseProps {
  allowedit: boolean = false;
  capturetype: string = 'IMAGE';
  iconclass: string = 'wi wi-photo-camera';
  iconsize: number = 16;
  imagequality: number = 80;
  imageencodingtype: string = 'JPEG';
  imagetargetwidth: number = null as any;
  imagetargetheight: number = null as any;
  datavalue: any;
  localFile: string = '';
  localFilePath: string = '';
}
