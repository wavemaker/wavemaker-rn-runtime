import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmRadiosetStyles = BaseStyles & {
  group: AllStyle,
  groupHeaderTitle: AllStyle;
  item: AllStyle;
  selectedItem: AllStyle;
  radioLabel: AllStyle;
  skeleton: WmSkeletonStyles;
  uncheckedRadio: WmIconStyles;
  checkedRadio: WmIconStyles;
};

export const DEFAULT_CLASS = 'app-radioset';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmRadiosetStyles = defineStyles({
      root: {
        color: themeVariables.checkedColor
      },
      text: {},
      group: {
        flexDirection: 'row',
        flexWrap: 'wrap'
      },
      groupHeaderTitle: {
        backgroundColor: themeVariables.groupHeadingBgColor,
        fontSize: 16,
        paddingLeft: 8,
        paddingRight: 8,
        lineHeight: 40,
        fontFamily: themeVariables.baseFont
      } as AllStyle,
      item: {
        flexDirection: 'row',
        alignContent: 'center',
        marginRight: -20,
        marginTop: 8
      } as AllStyle,
      noscrollitem:{
        flexDirection: 'row',
        alignContent: 'center',
        marginTop: 8, 
        marginLeft: 16 
      } as AllStyle,
      selectedItem: {} as AllStyle,
      selectedLabel: {} as AllStyle,
      radioLabel: {
          alignSelf: 'center',
          fontFamily: themeVariables.baseFont,
          fontSize: 16,
          color: themeVariables.labelDefaultColor,
          marginLeft: 8
      } as AllStyle,
      skeleton: {
        root: {
          width: '100%',
          height: 16,
          borderRadius: 4,
        }
      } as any as WmSkeletonStyles,
      uncheckedRadio: {
        root: {
          width: 20,
          height: 20,
          borderRadius: 10,
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: themeVariables.checkedBorderColor,
        },
        text: {},
        icon: {
          opacity: 0,
        }
      } as WmIconStyles,
      checkedRadio : {
        root: {
          width: 20,
          height: 20,
          borderRadius: 10,
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: themeVariables.checkedBorderColor,
        },
        text: {
          fontSize: 16,
        },
        icon : {
          color: themeVariables.checkedColor,
          padding: 0,
        }
  } as WmIconStyles
});

  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      color: themeVariables.checkedDisabledColor,
      opacity: 0.8
    }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
