import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import {
  BaseStyles,
  defineStyles,
} from '@wavemaker/app-rn-runtime/core/base.component';

export type ErrorFallbackStyles = BaseStyles & {
  imageContainer: AllStyle;
  errorImage: AllStyle;
  title: AllStyle;
  subtitle: AllStyle;
  errorCard: AllStyle;
  errorLabel: AllStyle;
  errorMessage: AllStyle;
  toggleButton: AllStyle;
  toggleText: AllStyle;
  toggleIcon: AllStyle;
  stackCard: AllStyle;
  stackHeader: AllStyle;
  stackTitle: AllStyle;
  copyIcon: AllStyle;
  copiedIcon: AllStyle;
  stackContainer: AllStyle;
  stackText: AllStyle;
  componentStackTitle: AllStyle;
  buttonContainer: AllStyle;
  primaryButton: AllStyle;
  primaryButtonText: AllStyle;
  secondaryButton: AllStyle;
  secondaryButtonText: AllStyle;
};

export const DEFAULT_CLASS = 'app-error-fallback';

BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: ErrorFallbackStyles = defineStyles({
    root: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    text: {},
    infoContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 24,
    },
    errorImage: {
      width: '80%',
      maxWidth: 150,
      height: undefined,
      aspectRatio: 1.2,
      maxHeight: 150,
      alignSelf: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      color: '#2d3748',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      color: '#71717A',
      marginBottom: 24,
      fontWeight: '400',
    },
    errorCard: {
      backgroundColor: 'rgba(245, 71, 70, 0.1)',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      height: 70,
      marginBottom: 16,
    },
    errorCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    errorLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#F54746',
    },
    errorMessage: {
      fontSize: 14,
      color: '#71717A',
      lineHeight: 20,
      fontWeight: 500,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    toggleText: {
      fontSize: 12,
      color: '#71717A',
      marginRight: 8,
    },
    toggleIcon: {
      fontSize: 18,
      color: '#090A0A',
      padding: 0,
    },
    stackCard: {
      backgroundColor: '#fff',
      marginBottom: 24,
    },
    stackHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    stackTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    copyIcon: {
      fontSize: 18,
      color: '#3B82F6',
      borderRadius: 6,
      padding: 0,
    },
    copiedIcon: {
      color: '#48bb78',
    },
    stackContainer: {
      maxHeight: 200,
      marginTop: 12,
    },
    stackText: {
      fontSize: 12,
      color: '#4a5568',
      lineHeight: 16,
      fontFamily: 'monospace',
    },
    componentStackTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2d3748',
      marginTop: 16,
      marginBottom: 8,
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    primaryButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginBottom: 16,
      alignSelf: 'center',
      width: '100%',
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 16,
      lineHeight: 24,
    },
    secondaryButton: {
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignSelf: 'center',
      width: '100%',
    },
    secondaryButtonText: {
      color: '#242424',
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 24,
    },
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('error-fallback-image', '', {
    root: defaultStyles.errorImage,
  });
  addStyle('error-fallback-title', '', {
    root: { alignSelf: 'center' },
    text: defaultStyles.title,
  });
  addStyle('error-fallback-subtitle', '', {
    root: { alignSelf: 'center' },
    text: defaultStyles.subtitle,
  });
  addStyle('error-fallback-erroricon', '', {
    icon: {fontSize: 15},
    text: { color: '#EF4444'},
  });
  addStyle('error-fallback-error-label', '', {
    text: defaultStyles.errorLabel,
  });
  addStyle('error-fallback-error-message', '', {
    root:{width:"100%"},
    text: defaultStyles.errorMessage,
  });
  addStyle('error-fallback-toggle-heading', '', {
    text: defaultStyles.toggleText,
  });
  addStyle('error-fallback-toggle-icon', '', {
    text: defaultStyles.toggleIcon,
  });
  addStyle('error-fallback-stacktitle', '', {
    root: { alignSelf: 'center' },
    text: defaultStyles.stackTitle,
  });
  addStyle('error-fallback-copyicon', '', {
    icon: defaultStyles.copyIcon,
  });
  addStyle('error-fallback-copiedIcon', '', {
    icon: defaultStyles.copiedIcon,
  });
  addStyle('error-fallback-stacktext', '', {
    text: defaultStyles.stackText,
  });
  addStyle('error-fallback-component-stacktitle', '', {
    text: defaultStyles.componentStackTitle,
  });
  addStyle('error-fallback-gotohome-btn', '', {
    root: defaultStyles.primaryButton,
    text: defaultStyles.primaryButtonText,
  });
  addStyle('error-fallback-goback-btn', '', {
    root: defaultStyles.secondaryButton,
    text: defaultStyles.secondaryButtonText,
  });
});
