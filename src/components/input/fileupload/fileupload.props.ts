import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmFileuploadProps extends BaseProps {
  iconclass: string = 'wm-sl-l sl-cloud-upload';
  iconsize: number = 16;
  caption: string = 'Upload';
  selectedFiles?: any;
}
