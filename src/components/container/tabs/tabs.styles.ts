import { ViewStyle } from 'react-native';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmTabheaderStyles } from './tabheader/tabheader.styles';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmTabsStyles = BaseStyles & {
  tabHeader: WmTabheaderStyles,
  tabContent: ViewStyle,
  skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-tabs';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmTabsStyles = defineStyles({
      root: {
        minHeight: 240,
        elevation: 0,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.tabBorderColor
      },
      text: {},
      tabContent: {},
      tabHeader: {} as WmTabheaderStyles,
      skeleton: { 
        root: {
        }
      } as WmSkeletonStyles
  });
  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('tabs-with-arrow-indicator', '', {
    tabHeader: {
      root: {
        backgroundColor: themeVariables.transparent
      },
      header: {
        marginBottom: 16
      },
      activeIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        height: 0
      },
      arrowIndicator: {
        display: 'flex',
        backgroundColor: themeVariables.tabArrowIndicatorBgColor,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{
          rotateZ: '45deg'
        }]
      },
      arrowIndicatorDot: {
        display: 'flex',
        backgroundColor: themeVariables.tabArrowIndicatorDotColor,
        width: 4,
        height: 4, 
        borderRadius: 8,
        transform: [{
          translateX: -2
        }, {
          translateY: -2
        }]
      }
    } as WmTabheaderStyles
  });
});
