import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '../button/button.styles';

export type WmButtongroupStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-buttongroup';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmButtongroupStyles = defineStyles({
      root: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.buttonGrpBorderColor,
        backgroundColor: themeVariables.buttonGrpBgColor
      }, text: {}
  });


  addStyle('btn-group-child', '', {
    root: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 1,
      borderRightWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
      flex: 1,
      borderColor: themeVariables.buttonGrpBorderColor,
    },
    text: {
      color: themeVariables.defaultColor9,
    }
  } as WmButtonStyles);
  addStyle('btn-group-first-child', '', {
    root: {
      borderLeftWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
      borderColor: themeVariables.buttonGrpBorderColor
    }
  } as WmButtonStyles);
  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
