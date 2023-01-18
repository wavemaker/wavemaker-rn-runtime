import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTextareaStyles = BaseStyles & {
  invalid: AllStyle;
  placeholderText: AllStyle;
};

export const DEFAULT_CLASS = 'app-textarea';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmTextareaStyles = defineStyles({
      root: {
        padding:12,
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderRadius: 6,
        fontFamily: themeVariables.baseFont,
        minHeight: 160,
      },
      text: {
        fontSize: 16,
        textAlignVertical: 'top'
      },
      invalid: {
        borderBottomColor: 'red'
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