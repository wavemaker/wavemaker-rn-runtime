import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCheckboxsetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  checkboxHead: AllStyle;
  checkbox: AllStyle;
  checkboxLabel: AllStyle;
};

export const DEFAULT_CLASS = 'app-checkboxset';
export const DEFAULT_STYLES: WmCheckboxsetStyles = {
    root: {},
    text: {},
  groupHeaderTitle: {
    backgroundColor: ThemeVariables.groupHeaderBackgroundColor,
    fontSize: 16,
    paddingLeft: 8,
    paddingRight: 8,
    lineHeight: 40,
  } as AllStyle,
  checkboxHead: {
    flexDirection: 'row',
    alignContent: 'center',
  } as AllStyle,
  checkbox: {
    flex: 1
  } as AllStyle,
  checkboxLabel: {
    flex: 4,
    alignSelf: 'center'
  } as AllStyle
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
