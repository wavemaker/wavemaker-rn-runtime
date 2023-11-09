import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmBarcodescannerStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-barcodescanner';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmBarcodescannerStyles = defineStyles({
      root: {},
      text: {},
      button: {
        root: {
          borderWidth: 1,
          borderColor: themeVariables.barcodeScannerBorderColor,
          borderStyle: 'solid',
          backgroundColor: themeVariables.barcodeScannerBgColor,
          borderRadius: 4
        },
        text: {
          color: themeVariables.barcodeScannerTextColor
        },
        icon: {
          text: {
            color: themeVariables.barcodeScannerTextColor
          },
          icon: {
            fontSize: 24
          }
        }
      } as WmButtonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
