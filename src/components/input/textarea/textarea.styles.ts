import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmTextareaStyles = BaseStyles & {
  invalid: AllStyle;
  placeholderText: AllStyle;
  skeleton: WmSkeletonStyles;
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
      },
      skeleton: {
        root: {
          width: '100%',
          height: 84,
          borderRadius: 4
        }
      } as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle(DEFAULT_CLASS + '-rtl', '', {
    root:{
      textAlign: 'right'
    }
  })
});