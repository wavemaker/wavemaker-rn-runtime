import BASE_THEME, {AllStyle, Theme} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import {ColorValue} from "react-native";

export type WmTextStyles = BaseStyles & {
  invalid: AllStyle;
  placeholderText: AllStyle;
};

export const DEFAULT_CLASS = 'app-text';
export const DEFAULT_STYLES: WmTextStyles = defineStyles({
    root: {
      padding: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.inputBorderColor,
      backgroundColor: ThemeVariables.inputBackgroundColor,
      borderRadius: 6,
      fontFamily: ThemeVariables.baseFont
    },
    text: {
      fontSize: 16
    },
    invalid: {
      borderBottomColor: ThemeVariables.inputInvalidBorderColor
    },
    placeholderText: {
     color: ThemeVariables.inputPlaceholderColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      backgroundColor: ThemeVariables.inputDisabledBgColor
    }
});
