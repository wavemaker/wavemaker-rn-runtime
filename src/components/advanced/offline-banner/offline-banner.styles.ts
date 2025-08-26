import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmOfflineBannerStyles = BaseStyles & {
  textContainer: any;
  offlineImage: any;
  retryButton: any
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
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  offlineImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 20,
  },
  
} as WmOfflineBannerStyles;