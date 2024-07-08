import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {WmLabelStyles} from "@wavemaker/app-rn-runtime/components/basic/label/label.styles";
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmFormStyles = BaseStyles & {
  heading: AllStyle,
  title: WmLabelStyles,
  listIcon: WmIconStyles,
  subheading: WmLabelStyles
};

export const DEFAULT_CLASS = 'app-form';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmFormStyles = defineStyles({
    root: {},
    text: {},
    heading : {
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 0,
      paddingRight: 0,
      borderBottomWidth: 0,
      borderStyle: 'solid',
      borderColor: themeVariables.formBorderColor
    },
    title: {
      text: {
        fontSize: themeVariables.heading4FontSize,
        color: themeVariables.formTitleColor,
        fontWeight: 'bold'
      }
    } as WmLabelStyles,
    subheading: {
      text: {
        fontSize: 12,
        lineHeight: 18,
        color: themeVariables.formSubTitleColor
      }
    } as WmLabelStyles,
    listIcon: {
      root: {
        fontSize: 18,
        marginRight: 8
      }
    } as WmIconStyles,
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('form-action', '', {
    root: {
      marginLeft: 12
    }
  } as BaseStyles);
});
