import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmTextareaStyles = BaseStyles & {
  invalid: AllStyle;
  focused: AllStyle;
  placeholderText: AllStyle;
  floatingLabel: AllStyle;
  activeFloatingLabel: AllStyle;
  skeleton: WmSkeletonStyles;
  helpText:AllStyle;
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
      floatingLabel: {},
      activeFloatingLabel: {},
      invalid: {
        borderBottomColor: 'red'
      },
      focused : {
        borderColor: themeVariables.inputFocusBorderColor,
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
      } as any as WmSkeletonStyles,
      helpText:{
        marginTop:5,
        textAlign:'right',
        fontSize: 13,
        color: ThemeVariables.INSTANCE.textAreaHelpTextColor
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-textarea-input-horizontal', '', {
    root: {
      flex: 1,
      minWidth: 0, // Allow shrinking below intrinsic content size if needed
      maxWidth: '100%', // Prevent overflow
    },
    text: {}
  } as BaseStyles);
  
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
  addStyle(DEFAULT_CLASS + '-with-label', '', {
    text:{
      paddingTop: 24
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
  })
});