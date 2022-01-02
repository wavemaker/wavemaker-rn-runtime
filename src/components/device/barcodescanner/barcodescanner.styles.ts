import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmBarcodescannerStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-barcodescanner';
export const DEFAULT_STYLES: WmBarcodescannerStyles = defineStyles({
    root: {},
    text: {},
    button: {
      root: {
        borderWidth: 1,
        borderColor: ThemeVariables.barcodeScannerBorderColor,
        borderStyle: 'solid',
        backgroundColor: ThemeVariables.barcodeScannerBgColor
      },
      text: {
        color: ThemeVariables.barcodeScannerTextColor
      },
      icon: {
        text: {
          color: ThemeVariables.barcodeScannerTextColor
        },
        icon: {
          fontSize: 24
        }
      }
    } as WmButtonStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
