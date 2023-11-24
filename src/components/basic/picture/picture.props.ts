import { AccessibilityRole, ImageResizeMode } from 'react-native';
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmPictureProps extends BaseProps {
  animation?: string = null as any;
  picturesource?: string = null as any;
  pictureplaceholder?: string = null as any;
  shape?: string = null as any;
  isSvg?: string = null as any;
  resizemode?: ImageResizeMode = 'stretch' as any;
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = 'image';
}
