import { ImageStyle } from 'react-native';
import BASE_THEME  from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPictureStyles = BaseStyles & {
  picture: ImageStyle
};

export const DEFAULT_CLASS = 'app-picture';
export const DEFAULT_STYLES: WmPictureStyles = {
  root: {
    maxWidth: '100%'
  },
  text: {},
  picture: {
    width: '100%',
    height: '100%'
  }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('rounded', DEFAULT_CLASS, {
  picture: {
    borderRadius: 6
  }
} as WmPictureStyles);
BASE_THEME.addStyle('thumbnail', DEFAULT_CLASS, {
  root: {
    backgroundColor: ThemeVariables.pictureThumbBgColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.pictureThumbBorderColor,
    borderRadius: 6,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
  }
} as WmPictureStyles);
