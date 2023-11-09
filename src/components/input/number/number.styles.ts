import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmNumberStyles = BaseStyles & {
  invalid: AllStyle;
  placeholderText: AllStyle;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-number';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmNumberStyles = defineStyles<WmNumberStyles>({
      root: {
        minHeight: 42,
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderRadius: 6,
        paddingLeft: 16,
        paddingRight: 16
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
      },
      skeleton: {} as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle(DEFAULT_CLASS + '-rtl', '', {
      root : {
        textAlign: 'right'
      }
  });
});

