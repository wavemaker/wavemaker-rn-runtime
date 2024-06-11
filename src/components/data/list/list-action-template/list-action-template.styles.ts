import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';

export type WmListActionTemplateStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-list-action-template';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmListActionTemplateStyles>({
        root: {
            flexDirection: 'row',
            marginBottom: 6
        },
        text: {}
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('list-action-btn', '', {
        root: {
          backgroundColor: themeVariables.transparent,
          borderColor: themeVariables.transparent,
          borderWidth: 0,
          borderRadius: 0,
          width: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          height: '100%'
         },
        text: {
          color: themeVariables.defaultColor,
          fontSize: 14,
          fontWeight: '600',
        },
        icon: {
          root: {},
          text: {}
        }
      } as any as WmButtonStyles);
});