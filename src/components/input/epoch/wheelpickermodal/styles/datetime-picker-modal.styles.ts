import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import {
  BaseStyles,
  defineStyles,
} from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';

export type WmDateTimePickerModalStyles = BaseStyles & {
  container: AllStyle;
  header: TextStyle;
  buttonWrapper: ViewStyle;
  cancelBtn: AllStyle;
  selectBtn: AllStyle;
};

export const DEFAULT_CLASS = 'app-datetime-picker-modal';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmDateTimePickerModalStyles = defineStyles({
    root: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      fontSize: 16,
    },
    flex1: {
      flex: 1,
    },
    container: {
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: 'center',
    },
    header: {
      width: '100%',
      textAlign: 'left',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    buttonWrapper: {
      marginTop: 40,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 20,
    },
    cancelBtn: {
      root: {
        flex: 1,
        borderWidth: 1,
        borderColor: themeVariables.wheelHighlightBorder,
        borderRadius: 20,
        minHeight: 40,
      },
      text: {
        fontWeight: '600',
      },
    },
    selectBtn: {
      root: {
        flex: 1,
        backgroundColor: themeVariables.wheelHighlightBorder,
        borderRadius: 20,
        minHeight: 40,
      },
      text: {
        color: 'white',
        fontWeight: '600',
      },
    },
  }) as WmDateTimePickerModalStyles;

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
