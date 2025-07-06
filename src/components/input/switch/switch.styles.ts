import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {WmIconStyles} from "@wavemaker/app-rn-runtime/components/basic/icon/icon.styles";
import { Platform } from 'react-native';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmSwitchStyles = BaseStyles & {
  loadingIcon: WmIconStyles,
  button: AllStyle,
  selectedButton: AllStyle,
  selectedButtonText: AllStyle,
  firstButton: AllStyle,
  lastButton: AllStyle,
  skeleton: WmSkeletonStyles,
  textSkeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-switch';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmSwitchStyles = defineStyles<WmSwitchStyles>({
      root: {
        minHeight: 24,
        padding: 4,
        flexDirection: 'row'
      },
      text: {
        fontWeight: '500',
        fontSize: 16,
        textTransform: 'uppercase',
        userSelect: 'none',
      },
    loadingIcon: {
      root: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 16
      },
      text: {
        color: themeVariables.listSubTitleColor
      }
    } as WmIconStyles,
    button: {
      backgroundColor: themeVariables.switchBgColor,
      color: themeVariables.switchTextColor,
      fontSize: 14,
      minWidth: 64,
      height: 40,
      paddingLeft: 16,
      paddingRight: 16,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      borderColor: themeVariables.switchBorderColor,
      borderWidth: 1,
      borderRightWidth: 0,
      fontWeight: '500',
      fontFamily: themeVariables.baseFont,
      justifyContent: 'center',
      alignItems: 'center'
    } as AllStyle,
    selectedButton: {
      color: themeVariables.switchActiveTextColor,
      backgroundColor: themeVariables.switchActiveBgColor,
      borderColor: themeVariables.switchBorderColor
    } as AllStyle,
    selectedButtonText: {
      fontWeight: '500',
      fontSize: 16,
      textTransform: 'uppercase'
    } as AllStyle,
    firstButton: {
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    } as AllStyle,
    lastButton: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderRightWidth: 1
    } as AllStyle,
    skeleton: {
      root: {
        width:64,
        height: 40,
        paddingLeft: 16,
        paddingRight: 16,
      },
    } as any as WmSkeletonStyles,
    textSkeleton: {
      root: {
        width: 30,
        height: 10,
        borderRadius: 4
      }
    } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-switch-input-horizontal', '', {
    root: {
      flex: 1, // Take remaining space after label
      minWidth: 0, // Allow shrinking below intrinsic content size if needed
      maxWidth: '100%' // Prevent overflow
    },
    text: {}
  } as BaseStyles);
  
  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root: {}
  });
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    firstButton:{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
    } ,
    lastButton:{
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    }
  }: Platform.OS=="android" ? {
    firstButton:{
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderRightWidth: 1,
      borderLeftWidth: 0
    } ,
    lastButton:{
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
      borderLeftWidth: 1
    }
  }:{});
  addStyle(DEFAULT_CLASS + '1-rtl', '', Platform.OS=="web"?{
    firstButton:{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 500,
      borderBottomRightRadius: 500,
      borderRightWidth: 0,
      borderLeftWidth: 1
    } ,
    lastButton:{
      flex: 1,
      borderTopLeftRadius: 500,
      borderBottomLeftRadius: 500,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 1,
      borderLeftWidth: 0
    }
  }: Platform.OS=="android" ? {
    firstButton:{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 500,
      borderBottomRightRadius: 500,
      borderRightWidth: 1,
      borderLeftWidth: 0
    } ,
    lastButton:{
      flex: 1,
      borderTopLeftRadius: 500,
      borderBottomLeftRadius: 500,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
      borderLeftWidth: 1
    }
  }:{});
  addStyle(DEFAULT_CLASS + '1', '', {
    firstButton: {
      borderTopLeftRadius: 500,
      borderBottomLeftRadius: 500,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    } as AllStyle,
    lastButton: {
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 500,
      borderBottomRightRadius: 500
    } as AllStyle
  } as WmSwitchStyles);
});
