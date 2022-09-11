import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {WmIconStyles} from "@wavemaker/app-rn-runtime/components/basic/icon/icon.styles";
import {WmLabelStyles} from "@wavemaker/app-rn-runtime/components/basic/label/label.styles";
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";

export type WmSwitchStyles = BaseStyles & {
  loadingIcon: WmIconStyles,
  button: AllStyle,
  selectedButton: AllStyle,
  firstButton: AllStyle,
  lastButton: AllStyle
};

export const DEFAULT_CLASS = 'app-switch';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmSwitchStyles = defineStyles<WmSwitchStyles>({
      root: {
        height: 38,
        width: '100%',
        flex: 1,
        flexDirection: 'row'
      },
      text: {
        fontWeight: '500',
        fontSize: 16,
        textTransform: 'capitalize'
      },
    loadingIcon: {
      root: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 16
      },
      text: {
        color: themeVariables.listSubTitleColor
      }
    } as WmIconStyles,
    button: {
      backgroundColor: themeVariables.switchBgColor,
      color: themeVariables.switchTextColor,
      flex: 1,
      fontSize: 16,
      minWidth: 64,
      borderRadius: 0,
      borderColor: themeVariables.switchBorderColor,
      fontWeight: 'bold'
    } as AllStyle,
    selectedButton: {
      color: themeVariables.switchActiveTextColor,
      backgroundColor: themeVariables.switchActiveBgColor,
      borderColor: themeVariables.switchActiveBgColor
    } as AllStyle,
    firstButton: {
      flex: 1,
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    } as AllStyle,
    lastButton: {
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6
    } as AllStyle
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root: {}
  });
  addStyle(DEFAULT_CLASS + '1', '', {
    firstButton: {
      borderTopLeftRadius: 500,
      borderBottomLeftRadius: 500,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    } as AllStyle,
    lastButton: {
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 500,
      borderBottomRightRadius: 500
    } as AllStyle
  } as WmSwitchStyles);
});