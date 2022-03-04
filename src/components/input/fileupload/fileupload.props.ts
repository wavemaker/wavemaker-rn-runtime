import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFileuploadProps extends BaseProps {
  iconclass: string = 'wi wi-upload';
  iconsize: number = 16;
  caption: string = 'Upload';
  selectedFiles?: any;
}
