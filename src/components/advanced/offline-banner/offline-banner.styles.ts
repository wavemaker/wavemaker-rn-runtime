import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import {
  BaseStyles,
  defineStyles,
} from '@wavemaker/app-rn-runtime/core/base.component';
import { WmLabelStyles } from '../../basic/label/label.styles';
import { WmButtonStyles } from '../../basic/button/button.styles';

export type WmOfflineBannerStyles = BaseStyles & {
  imageContainer: AllStyle;
  textContainer: AllStyle;
};

export const DEFAULT_CLASS = 'app-offline-banner';

BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmOfflineBannerStyles = defineStyles({
    root: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeVariables.pageContentBgColor,
      paddingHorizontal: 20,
    },
    text: {},
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
  })

  addStyle(DEFAULT_CLASS, '', defaultStyles);

  addStyle('offline-banner-image', '', {
    root: {
      width: '80%',
      maxWidth: 150,
      height: undefined,
      aspectRatio: 1.2,
      maxHeight: 150,
      alignSelf: 'center',  
    } as any
  });

  addStyle('offline-banner-message', '', {
    root: {
      alignSelf: 'center',
      marginBottom: 8,
    },
    text: {
      fontSize: 24,
      fontWeight: '500',
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'monospace'
    },
  } as WmLabelStyles);

  addStyle('offline-banner-subtitle', '', {
    root: {
      alignSelf: 'center',
    },
    text: {
      fontSize: 16,
      color: '#a0a0a0',
      textAlign: 'center',
      lineHeight: 24,
      fontFamily: 'monospace',
    },
  } as WmLabelStyles);

  addStyle('offline-banner-retry-button', '', {
    root: {
      marginTop: 20,
      backgroundColor: themeVariables.buttonPrimaryColor,
      paddingVertical: 12,
      borderRadius: 6,
      alignSelf: 'center',
    },
    text: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: 'monospace',
    },
    badge: {
      backgroundColor: '#ffffff',
      color: '#3498db',
    }
  } as WmButtonStyles);

});


