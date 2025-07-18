import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmNumberStyles = BaseStyles & {
  invalid: AllStyle;
  focused: AllStyle;
  placeholderText: AllStyle;
  floatingLabel: AllStyle;
  activeFloatingLabel: AllStyle;
  skeleton: WmSkeletonStyles;
  skeletonLabel: WmSkeletonStyles;
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
      focused : {
        borderColor: themeVariables.inputFocusBorderColor,
      },
      placeholderText: {
        color: themeVariables.inputPlaceholderColor
      },
      floatingLabel: {},
      activeFloatingLabel: {},
      skeleton: {
        root:{
          borderRadius: 6,
          paddingLeft: 16,
          paddingRight: 16,
          minHeight: 42,
          paddingTop: 8,
          paddingBottom: 8,
          width: '100%',
          height: 40,
        },
      } as any as WmSkeletonStyles,
      skeletonLabel: {
        root: {
          bottom: 12,
          left: 16,
          width:80,
          height:16,
          borderRadius:4
        }
      } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-number-input-horizontal', '', {
    root: {
      flex: 1,
      minWidth: 0, // Allow shrinking below intrinsic content size if needed
      maxWidth: '100%'
    },
    text: {}
  } as BaseStyles);
  
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
  addStyle(DEFAULT_CLASS + '-with-label', '', {
    root: {
      minHeight: 48
    },
    floatingLabel: {
      position: 'absolute',
      top: 12,
      left: 16,
      fontSize: 14,
      color: themeVariables.floatingLabelColor
    },
    activeFloatingLabel: {
      color: themeVariables.activeFloatingLabelColor
    }
  });
});

