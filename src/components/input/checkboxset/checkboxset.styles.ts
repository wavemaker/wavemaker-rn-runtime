import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmCheckboxsetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  item: AllStyle;
  skeleton: WmSkeletonStyles;
  checkicon: WmIconStyles;
  checkedItem: AllStyle;
  uncheckicon: WmIconStyles;
};

export const DEFAULT_CLASS = 'app-checkboxset';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmCheckboxsetStyles = defineStyles({
      root: {},
      text: {
        alignSelf: 'center',
        fontFamily: themeVariables.baseFont,
        fontSize: 16,
        color: themeVariables.labelDefaultColor,
        marginLeft: 8,
      },
    groupHeaderTitle: {
      backgroundColor: themeVariables.groupHeadingBgColor,
      fontSize: 16,
      paddingLeft: 8,
      paddingRight: 8,
      lineHeight: 40,
      fontFamily: themeVariables.baseFont
    } as AllStyle,
    checkedItem: {} as AllStyle,
    item: {
      flexDirection: 'row',
      alignContent: 'center',
      marginRight: -20,
      marginTop: 8
    } as AllStyle,
    skeleton: {
      root: {
        width: '100%',
        height: 16
      }
    } as any as WmSkeletonStyles,
    checkicon : {
      root: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: themeVariables.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: themeVariables.checkedBorderColor,
      },
      text: {
        fontSize: 18,
      },
      icon : {
        color: themeVariables.checkedIconColor,
        padding: 0
      }
  } as WmIconStyles,
    uncheckicon : {
      root: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: themeVariables.uncheckedBorderColor,
      },
      text: {},
      icon : {
        color: 'transparent',
      }
  } as WmIconStyles,
  });

  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root: {
      opacity: 0.8
    },
    text : {
      color: themeVariables.checkedDisabledColor
    }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
