import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {WmIconStyles} from "@wavemaker/app-rn-runtime/components/basic/icon/icon.styles";
import {WmLabelStyles} from "@wavemaker/app-rn-runtime/components/basic/label/label.styles";
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";

export type WmSwitchStyles = BaseStyles & {
  loadingIcon: WmIconStyles,
  buttonStyles: AllStyle,
  selectedButtonStyles: AllStyle,
  firstButtonStyles: AllStyle,
  lastButtonStyles: AllStyle
};

export const DEFAULT_CLASS = 'app-switch';
export const DEFAULT_STYLES: WmSwitchStyles = {
    root: {
      height: 38,
      width: '100%',
      flex: 1,
      flexDirection: 'row'
    },
    text: {},
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
  buttonStyles: {
    height: 'inherit',
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 0
  } as AllStyle,
  selectedButtonStyles: {
    backgroundColor: ThemeVariables.buttonPrimaryColor
  } as AllStyle,
  firstButtonStyles: {
    height: 'inherit',
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 500,
    borderBottomLeftRadius: 500,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  } as AllStyle,
  lastButtonStyles: {
    height: 'inherit',
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 500,
    borderBottomRightRadius: 500
  } as AllStyle
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
