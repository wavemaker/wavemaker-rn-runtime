import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmOfflineBannerStyles = BaseStyles & {
  container: any;
  contentContainer: any;
  textContainer: any;
  imageContainer: any;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-offline-banner';
export default {
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  skeleton: {
    root: {
      backgroundColor: '#e0e0e0',
      borderRadius: 4,
    },
  },
} as WmOfflineBannerStyles;