import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmNumberStyles = BaseStyles & {
  invalid: AllStyle;
  placeholderText: AllStyle;
};

export const DEFAULT_CLASS = 'app-number';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmNumberStyles = defineStyles<WmNumberStyles>({
      root: {
        padding: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderRadius: 6
      },
      text: {
        fontSize: 16,
        textAlign: 'left'
      },
      invalid: {
        borderBottomColor: themeVariables.inputInvalidBorderColor
      },
      placeholderText: {
        color: themeVariables.inputPlaceholderColor
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
});

