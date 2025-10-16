import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
export type WmBottomsheetStyles = BaseStyles & {
  root: ViewStyle;
  backdrop: ViewStyle;
  container: ViewStyle;
  dragHandleContainer: ViewStyle;
  dragIconHandle: ViewStyle;
  sheetContentContainer: ViewStyle;
  sheetScrollContent: ViewStyle;
  modalOverlay: ViewStyle;
  centeredOverlay: ViewStyle;
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
            backgroundColor: ThemeVariables.INSTANCE.bottomSheetBgColor
        },
        container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 5,
            borderTopWidth: 0.5,
            borderColor: ThemeVariables.INSTANCE.bottomSheetBgColor,
            width: '100%',
            maxHeight: '100%', // Allow full screen height
        },
        dragHandleContainer: {
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: ThemeVariables.INSTANCE.bottomSheetBgColor,
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
        },
        dragIconHandle: {
            width: 36,
            height: 4,
            backgroundColor: ThemeVariables.INSTANCE.bottomSheetDragIconcolor,
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
        modalOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        centeredOverlay: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        skeleton: {
        root: {
         
        }
      } as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});