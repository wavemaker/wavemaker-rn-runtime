import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {WmLabelStyles} from "@wavemaker/app-rn-runtime/components/basic/label/label.styles";
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";

export type WmFormStyles = BaseStyles & {
  heading: AllStyle,
  title: WmLabelStyles,
  subheading: WmLabelStyles
};

export const DEFAULT_CLASS = 'app-form';
export const DEFAULT_STYLES: WmFormStyles = {
  root: {},
  text: {},
  heading : {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12
  },
  title: {
    root: {
      fontSize: 16,
      lineHeight: 24,
      color: ThemeVariables.formTitleColor
    }
  } as WmLabelStyles,
  subheading: {
    root: {
      fontSize: 12,
      lineHeight: 18,
      color: ThemeVariables.formSubTitleColor
    }
  } as WmLabelStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
