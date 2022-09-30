import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME  from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';

export type WmSpinnerStyles = BaseStyles & {
  icon: WmIconStyles
  image: WmPictureStyles
};

export const DEFAULT_CLASS = 'app-spinner';
export const DEFAULT_STYLES: WmSpinnerStyles = defineStyles({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    paddingLeft: 8
  },
  icon: {
    text: {
      fontSize: 24,
      color: ThemeVariables.spinnerIconColor
    }
  } as WmIconStyles,
  image: {} as WmPictureStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
