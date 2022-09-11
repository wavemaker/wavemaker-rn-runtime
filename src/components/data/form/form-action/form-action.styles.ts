import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmFormActionStyles = WmButtonStyles & {};

export const DEFAULT_CLASS = 'app-form-action';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmFormActionStyles = defineStyles({
    root: {
      marginTop: 0,
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
      flex: 1
    },
    text: {},
    icon : {
      icon: {
        fontSize: 20
      }
    }
  } as WmFormActionStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      opacity: 0.5
    }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
