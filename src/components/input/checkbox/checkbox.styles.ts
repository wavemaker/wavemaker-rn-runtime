import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmCheckboxStyles = BaseStyles & {
  checkboxLabel: AllStyle
  skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-checkbox';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCheckboxStyles = defineStyles({
        root: {
          flexDirection: 'row',
          alignContent: 'center',
        },
        text: {
          color: themeVariables.checkedColor
        },
        checkboxLabel: {
          alignSelf: 'center',
          fontFamily: themeVariables.baseFont,
          fontSize: 16,
          color: themeVariables.labelDefaultColor
        },
        skeleton: {} as WmSkeletonStyles
    });


    addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        opacity: 0.8
      },
      checkboxLabel : {
        color: themeVariables.checkedDisabledColor
      }
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
  });
