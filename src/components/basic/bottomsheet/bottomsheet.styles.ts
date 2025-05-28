import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';
export type WmBottomsheetStyles = BaseStyles & {
  root: ViewStyle;
  backdrop: ViewStyle;
  sheetContainer: ViewStyle;
  dragHandleContainer: ViewStyle;
  dragHandle: ViewStyle;
  sheetContentContainer: ViewStyle;
  sheetScrollContent: ViewStyle;
  sheetContent: ViewStyle;
  sheetText: TextStyle;
  skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-bottomsheet';

BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmBottomsheetStyles>({
        root: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            elevation: 9999,
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end', // This pushes content to bottom
        },
        text: {},
        backdrop: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.1)',
        },
        sheetContainer: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 5,
            borderTopWidth: 0.5,
            borderColor: 'rgba(0,0,0,0.1)',
            width: '100%',
            maxHeight: '100%', // Allow full screen height
            minHeight: 100, // Minimum height to prevent too small sheets
        },
        dragHandleContainer: {
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
        },
        dragHandle: {
            width: 36,
            height: 4,
            backgroundColor: 'rgba(60,60,67,0.3)',
            borderRadius: 2,
        },
        sheetContentContainer: {
            flex: 1,
            maxHeight: '100%', // Ensure it doesn't exceed container
        },
        sheetScrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            flexGrow: 1,
        },
        sheetContent: {},
        sheetText: {
            fontSize: 18,
            marginBottom: 10,
            textAlign: 'center',
        },
        skeleton: {
        root: {
          width: 96,
          height: 48,
          borderRadius: 4
        }
      } as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});