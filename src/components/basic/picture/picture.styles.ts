import { ImageStyle } from 'react-native';
import BASE_THEME  from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPictureStyles = BaseStyles & {
  picture: ImageStyle
};

export const DEFAULT_CLASS = 'app-picture';
export const DEFAULT_STYLES: WmPictureStyles = defineStyles({
  root: {},
  text: {},
  picture: {
    width: '100%',
    height: '100%'
  }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('rounded-image', '', {
  picture: {
    borderRadius: 6
  }
} as WmPictureStyles);
BASE_THEME.addStyle('thumbnail-image', '', {
  root: {
    backgroundColor: ThemeVariables.pictureThumbBgColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.pictureThumbBorderColor,
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8 
  }
} as WmPictureStyles);
