import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmGridRowStyles = BaseStyles & {
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-gridrow';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmGridRowStyles = defineStyles({
      root: {
          flexDirection: 'row',
          width: '100%',
          flexWrap: 'wrap'
      },
      text: {},
      skeleton: {
        root: {
          borderColor: 'transparent'
        } 
      } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('table-row', '', {
      root: {
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: themeVariables.gridColumnBorderColor
      }
  });
  addStyle('table-header-row', '', {
      root: {
          backgroundColor: themeVariables.layoutGridHeaderBgColor
      }
  });
  addStyle('table-striped-row0', '', {
    root: {
      backgroundColor: themeVariables.layoutGridStripColor1
    }
  });
  addStyle('table-striped-row1', '', {
    root: {
      backgroundColor: themeVariables.layoutGridStripColor2
    }
  });
});