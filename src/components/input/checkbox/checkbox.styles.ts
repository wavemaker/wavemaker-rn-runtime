import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmCheckboxStyles = BaseStyles & {
  skeleton: WmSkeletonStyles;
  checkicon: WmIconStyles;
  uncheckicon: WmIconStyles;
};

export const DEFAULT_CLASS = 'app-checkbox';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCheckboxStyles = defineStyles({
        root: {
          flexDirection: 'row',
          alignContent: 'center',
        },
        text: {
          alignSelf: 'center',
          fontFamily: themeVariables.baseFont,
          fontSize: 16,
          color: themeVariables.labelDefaultColor,
          marginLeft: 8
        },
        skeleton: {
          root: {
            width: 20,
            height: 20,
            borderRadius: 4,
          },
          icon: {
            width: 20,
            height: 20,
            borderRadius: 4,
          },
          label: {
            width: 200,
            borderRadius: 4,
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
            backgroundColor: themeVariables.uncheckedBgColor,
          },
          text: {},
          icon : {
            color: 'transparent',
          }
      } as WmIconStyles,
      checkedItem: {} as AllStyle,
      selectedLabel: {} as AllStyle,
      });


    addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        opacity: 0.8
      },
      text : {
        color: themeVariables.checkedDisabledColor
      }
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
  });
