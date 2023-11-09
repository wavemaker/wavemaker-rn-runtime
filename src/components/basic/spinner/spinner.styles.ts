import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME, { NamedStyles, AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';

export type WmSpinnerStyles = BaseStyles & {
  icon: WmIconStyles
  image: WmPictureStyles
  lottie: AllStyle
};

export const DEFAULT_CLASS = 'app-spinner';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmSpinnerStyles = defineStyles({
    root: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      fontSize: 16,
      paddingLeft: 8
    },
    icon: {
      text: {
        fontSize: 48,
        width: 4,
        color: themeVariables.spinnerIconColor
      }
    } as WmIconStyles,
    image: {} as WmPictureStyles,
    lottie: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      justifyContent: 'center'
    }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', {
    root : {
      textAlign: 'right'
    },
    text: {
      paddingRight: 8
    }
  });
});
