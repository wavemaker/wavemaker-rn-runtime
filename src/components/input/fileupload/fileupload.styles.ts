import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmFileuploadStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-fileupload';
export const DEFAULT_STYLES: WmFileuploadStyles = defineStyles({
  root: {
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: ThemeVariables.fileuploadBorderColor,
    borderStyle: 'solid',
    backgroundColor: ThemeVariables.fileuploadBgColor
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

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
