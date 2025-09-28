import React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  navigate,
  goBackRef,
} from '@wavemaker/app-rn-runtime/core/navigation.service';
import * as Clipboard from 'expo-clipboard';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';

import { ThemeConsumer } from '@wavemaker/app-rn-runtime/styles/theme';
import { DEFAULT_CLASS, ErrorFallbackStyles } from './error-fallback.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

interface FallbackProps {
  error: Error;
  info?: any;
  resetErrorBoundary?: () => void;
  errorType?: 'render' | 'javascript';
}

const Fallback = (props: FallbackProps) => {
  const { error, info, resetErrorBoundary, errorType = 'render' } = props;
  const [showStack, setShowStack] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const insets = useSafeAreaInsets();

  // Dynamic titles based on error type
  const getErrorTitle = () => {
    if (errorType === 'javascript') {
      return 'Something went wrong.';
    }
    return 'Something went wrong.'; // Same for now, can be customized
  };

  const getErrorSubtitle = () => {
    if (errorType === 'javascript') {
      return 'An unexpected error occurred in the application.';
    }
    return 'Please try again.';
  };

  const copyErrorToClipboard = async () => {
    let errorDetails = `
Error Type: ${errorType}
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack available'}`;

    // Add component stack for render errors
    if (errorType === 'render' && info?.componentStack) {
      errorDetails += `
Component Stack: ${info.componentStack}`;
    }

    errorDetails = errorDetails.trim();

    await Clipboard.setStringAsync(errorDetails);
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
    <ThemeConsumer>
      {(theme) => {
        const errorFallbackStyles = theme.getStyle(
          DEFAULT_CLASS
        ) as ErrorFallbackStyles;
          const imageSource = appConfig?.preferences?.errorImage;

        return (
          <View
            style={[
              { paddingTop: insets?.top, paddingBottom: insets?.bottom },
              errorFallbackStyles.root,
            ]}
          >
            {/* Error Image */}
            <View style={errorFallbackStyles.infoContainer}>
              <View style={errorFallbackStyles.imageContainer}>
                 <WmPicture
                    picturesource={imageSource}
                    resizemode="contain"
                    name="picture2"
                    classname="error-fallback-image"
                  />
              </View>

              <WmLabel
                caption={getErrorTitle()}
                classname="error-fallback-title"
              />
              <WmLabel
                caption={getErrorSubtitle()}
                classname="error-fallback-subtitle"
              />

              {__DEV__ && (<View style={errorFallbackStyles.errorCard}>
                <View style={errorFallbackStyles.errorCardRow}>
                  <WmIcon
                    id={'error-icon'}
                    iconclass="wi wi-error"
                    classname="error-fallback-erroricon"
                  ></WmIcon>
                  <WmLabel
                    caption={'Error'}
                    classname="error-fallback-error-label"
                  />
                </View>
                <WmLabel
                  caption={error?.message || 'An unexpected error occurred'}
                  classname="error-fallback-error-message"
                  nooflines={1}
                  enableandroidellipsis={true}
                />
              </View>)}

              {__DEV__ && (<TouchableOpacity
                style={errorFallbackStyles.toggleButton}
                onPress={() => setShowStack(!showStack)}
              >
                <WmLabel
                  caption={`${showStack ? 'Hide' : 'Show'} Error Details`}
                  classname="error-fallback-toggle-heading"
                />
                <Text style={{}}>
                  {showStack ? (
                    <WmIcon
                      id={'error-stack-arrow-up'}
                      iconclass="wi wi-keyboard-arrow-up"
                      classname="error-fallback-toggle-icon"
                    ></WmIcon>
                  ) : (
                    <WmIcon
                      id={'error-stack-arrow-down'}
                      iconclass="wi wi-keyboard-arrow-down"
                      classname="error-fallback-toggle-icon"
                    ></WmIcon>
                  )}
                </Text>
              </TouchableOpacity>)}

              {(showStack && __DEV__) && (
                <View style={errorFallbackStyles.stackCard}>
                  <View style={errorFallbackStyles.stackHeader}>
                    <WmLabel
                      caption={'Error Stack:'}
                      classname="error-fallback-stacktitle"
                    />
                    <WmIcon
                      id={'error-stack-content-copy'}
                      iconclass="wi wi-content-copy"
                      onTap={copyErrorToClipboard}
                      disabled={isCopied}
                      classname={
                        isCopied
                          ? 'error-fallback-copyicon error-fallback-copiedIcon'
                          : 'error-fallback-copyicon'
                      }
                    />
                  </View>
                  <ScrollView
                    style={errorFallbackStyles.stackContainer}
                    showsVerticalScrollIndicator={true}
                  >
                    <WmLabel
                      caption={error?.stack || 'No stack trace available'}
                      classname="error-fallback-stacktext"
                    />
                    {errorType === 'render' && info?.componentStack && (
                      <>
                        <WmLabel
                          caption="Component Stack:"
                          classname="error-fallback-component-stacktitle"
                        />
                        <WmLabel
                          caption={info.componentStack}
                          classname="error-fallback-stacktext"
                        />
                      </>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={errorFallbackStyles.buttonContainer}>
              <WmButton
                caption="Go to Home"
                onTap={handleGoHome}
                classname="error-fallback-gotohome-btn"
              />
              <WmButton
                caption="Go Back"
                onTap={handleGoBack}
                classname="error-fallback-goback-btn"
              />
            </View>
          </View>
        );
      }}
    </ThemeConsumer>
  );
};

export default Fallback;
