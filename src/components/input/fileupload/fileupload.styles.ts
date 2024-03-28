import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmFileuploadStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-fileupload';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmFileuploadStyles = defineStyles({
    root: {
      borderRadius: 32,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: themeVariables.fileuploadBorderColor,
      borderStyle: 'solid',
      backgroundColor: themeVariables.fileuploadBgColor
    },
    text: {

    },
    button: {
      root: {},
      text: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        textTransform: 'capitalize',
      }
    } as WmButtonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
