import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ViewStyle } from 'react-native';

export type WmTooltipStyles = BaseStyles & {
  tooltip: ViewStyle;
  triangle: ViewStyle;
};

export const DEFAULT_CLASS = 'app-tooltip';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmTooltipStyles = defineStyles({
    root: {
      position: 'relative',
    },
    text: {
      fontSize: 16
    },
    tooltip: {
      position: 'absolute',
      left: -30,
      minWidth: 60,
      minHeight: 25,
      paddingHorizontal: 10,
      borderRadius: 20,
      backgroundColor: 'lightblue',
      justifyContent: 'center',
      alignItems: 'center',
  
      // * shadow
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      elevation: 3,
    },
    triangle: {
      position: 'absolute',
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'lightblue',
      overflow: 'hidden',
    },
  })

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});