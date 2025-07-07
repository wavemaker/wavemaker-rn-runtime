import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  navigate,
  goBackRef,
} from '@wavemaker/app-rn-runtime/core/navigation.service';
// import * as Clipboard from 'expo-clipboard';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';

const Fallback = (props: any) => {
  const { error, info, resetErrorBoundary } = props;
  const [showStack, setShowStack] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const appConfig = injector.get<AppConfig>('APP_CONFIG');

  const copyErrorToClipboard = async () => {
    const errorDetails = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack available'}
Component Stack: ${info?.componentStack || 'No component stack available'}
    `.trim();

    // await Clipboard.setStringAsync(errorDetails);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleGoBack = () => {
    goBackRef();
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  const handleGoHome = () => {
    navigate(appConfig.appProperties.homePage, {});
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  return (
    <View style={styles.container}>
      {/* Error Image */}
      {/* <View style={styles.imageContainer}>
        {
          <Image
            source={require('./something_wrong.png')}
            style={styles.errorImage}
            resizeMode="contain"
          />
        }
      </View> */}

      {/* Error Message */}
      <Text style={styles.title}>Something went wrong.</Text>
      <Text style={styles.subtitle}>Please try again.</Text>

      {/* Main Error Display */}
      <View style={styles.errorCard}>
        <Text style={styles.errorLabel}>Error:</Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'An unexpected error occurred'}
        </Text>
      </View>

      {/* Stack Toggle */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowStack(!showStack)}
      >
        <Text style={styles.toggleText}>
          {showStack ? 'Hide' : 'Show'} Error Details
        </Text>
        <Text style={styles.toggleIcon}>{showStack ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Stack Details */}
      {showStack && (
        <View style={styles.stackCard}>
          <View style={styles.stackHeader}>
            <Text style={styles.stackTitle}>Error Stack</Text>
            {/* <TouchableOpacity
              onPress={copyErrorToClipboard}
              style={[styles.copyButton, isCopied && styles.copiedButton]}
              disabled={isCopied}
            >
              <Text
                style={[
                  styles.copyButtonText,
                  isCopied && styles.copiedButtonText,
                ]}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity> */}
          </View>
          <ScrollView
            style={styles.stackContainer}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.stackText} selectable={true}>
              {error?.stack || 'No stack trace available'}
            </Text>
            {info?.componentStack && (
              <>
                <Text style={styles.componentStackTitle}>Component Stack:</Text>
                <Text style={styles.stackText} selectable={true}>
                  {info.componentStack}
                </Text>
              </>
            )}
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  errorImage: {
    width: 200,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#718096',
    marginBottom: 30,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f56565',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e53e3e',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 22,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    color: '#4a5568',
    marginRight: 8,
  },
  toggleIcon: {
    fontSize: 12,
    color: '#4a5568',
  },
  stackCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  copyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4299e1',
    borderRadius: 6,
  },
  copiedButton: {
    backgroundColor: '#48bb78',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  copiedButtonText: {
    color: '#fff',
  },
  stackContainer: {
    maxHeight: 200,
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4299e1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Fallback;
