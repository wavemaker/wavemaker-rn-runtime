import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';

export type WmWheelPickerStyles = BaseStyles & {
  center: ViewStyle;
  selectedItemBg: ViewStyle;
  itemBg: ViewStyle;
  selectedItemText: TextStyle;
  itemText: TextStyle;
  disabled: ViewStyle;
};

export const DEFAULT_CLASS = 'app-wheel-picker';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmWheelPickerStyles = defineStyles({
        root: {
          position: 'relative',
          width: 100,
          overflow: 'hidden',
        },
        text: {
          fontSize: 16
        },
        gestureRoot: {
          height: '100%',
        },
        center: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        selectedItemBg: {
          pointerEvents: 'none',
          position: 'absolute',
          width: '100%',
          borderTopColor: themeVariables.wheelHighlightBorder,
          borderBottomColor: themeVariables.wheelHighlightBorder,
          borderTopWidth: 2,
          borderBottomWidth: 2,
        },
        itemBg: {
          backgroundColor: 'transparent',
        },
        selectedItemText: {
          fontSize: 18,
          fontWeight: '600',
          color: themeVariables.wheelSelectedTextColor,
        },
        itemText: {
          fontSize: 17,
          fontWeight: '400',
          color: themeVariables.wheelTextColor,
        },
        disabled: {
          pointerEvents: 'none'
        }
    }) as WmWheelPickerStyles;

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle(DEFAULT_CLASS + '-disabled', '', {
        root : {
          opacity: 0.5
        }
    });
});
