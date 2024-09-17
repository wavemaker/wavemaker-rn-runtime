import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmLayoutGridStyles = BaseStyles & {
  skeleton: WmSkeletonStyles
}

export const DEFAULT_CLASS = 'app-layoutgrid';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmLayoutGridStyles = defineStyles({
      root: {
        flexDirection: 'column',
        width: '100%'
      },
      text: {},
      skeleton: {
        root: {
        }
      } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);

  addStyle('table', '', {
    root: {
      backgroundColor: themeVariables.layoutGridBgColor,
      borderWidth: 1,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderStyle: 'solid',
      borderColor: themeVariables.layoutGridBorderColor,
      borderRadius: 2
    }
  });

  addStyle('table-header-label', '', {
      text: {
        color: themeVariables.layoutGridHeaderTextColor,
        fontWeight: 'bold'
      }
  } as WmLabelStyles);
});
