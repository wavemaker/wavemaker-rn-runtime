import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCheckboxsetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  checkboxHead: AllStyle;
  checkboxLabel: AllStyle;
};

export const DEFAULT_CLASS = 'app-checkboxset';
export const DEFAULT_STYLES: WmCheckboxsetStyles = defineStyles({
    root: {},
    text: {
      color: ThemeVariables.checkedColor
    },
  groupHeaderTitle: {
    backgroundColor: ThemeVariables.groupHeaderBackgroundColor,
    fontSize: 16,
    paddingLeft: 8,
    paddingRight: 8,
    lineHeight: 40,
    fontFamily: ThemeVariables.baseFont
  } as AllStyle,
  checkboxHead: {
    flexDirection: 'row',
    alignContent: 'center',
  } as AllStyle,
  checkboxLabel: {
    alignSelf: 'center',
    fontFamily: ThemeVariables.baseFont
  } as AllStyle
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
