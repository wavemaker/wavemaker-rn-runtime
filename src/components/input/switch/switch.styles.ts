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
export const DEFAULT_STYLES: WmSwitchStyles = defineStyles<WmSwitchStyles>({
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
      color: ThemeVariables.listSubTitleColor
    }
  } as WmIconStyles,
  button: {
    backgroundColor: ThemeVariables.switchBgColor,
    color: ThemeVariables.switchTextColor,
    flex: 1,
    fontSize: 16,
    borderRadius: 0,
    borderColor: ThemeVariables.switchBorderColor,
    fontWeight: 'bold'
  } as AllStyle,
  selectedButton: {
    color: ThemeVariables.switchActiveTextColor,
    backgroundColor: ThemeVariables.switchActiveBgColor,
    borderColor: ThemeVariables.switchActiveBgColor
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

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
  root: {}
});
BASE_THEME.addStyle(DEFAULT_CLASS + '1', '', {
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