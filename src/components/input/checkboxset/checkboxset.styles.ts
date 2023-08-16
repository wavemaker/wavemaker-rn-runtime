import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmCheckboxsetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  checkboxHead: AllStyle;
  checkboxLabel: AllStyle;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-checkboxset';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmCheckboxsetStyles = defineStyles({
      root: {},
      text: {
        color: themeVariables.checkedColor
      },
    groupHeaderTitle: {
      backgroundColor: themeVariables.groupHeadingBgColor,
      fontSize: 16,
      paddingLeft: 8,
      paddingRight: 8,
      lineHeight: 40,
      fontFamily: themeVariables.baseFont
    } as AllStyle,
    checkboxHead: {
      flexDirection: 'row',
      alignContent: 'center',
    } as AllStyle,
    checkboxLabel: {
      alignSelf: 'center',
      fontFamily: themeVariables.baseFont,
      fontSize: 16,
      color: themeVariables.labelDefaultColor
    } as AllStyle,
    skeleton: {
      root: {
        width: '100%',
        height: 16
      }
    } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root: {
      opacity: 0.8
    },
    checkboxLabel : {
      color: themeVariables.checkedDisabledColor
    }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
