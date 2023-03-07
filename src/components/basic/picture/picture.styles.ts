import { ImageStyle } from 'react-native';
import BASE_THEME  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';

export type WmPictureStyles = BaseStyles & {
  picture: ImageStyle,
  skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-picture';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmPictureStyles = defineStyles({
    root: {
      overflow: 'hidden'
    },
    text: {},
    picture: {
      width: '100%',
      height: '100%'
    },
    skeleton: {
      root: {
        width: '100%',
        height: 128
      }
    } as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('rounded-image', '', {
    picture: {
      borderRadius: 6
    }
  } as WmPictureStyles);
  addStyle('thumbnail-image', '', {
    root: {
      backgroundColor: themeVariables.pictureThumbBgColor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeVariables.pictureThumbBorderColor,
      borderRadius: 6,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      paddingRight: 8
    }
  } as WmPictureStyles);
});
