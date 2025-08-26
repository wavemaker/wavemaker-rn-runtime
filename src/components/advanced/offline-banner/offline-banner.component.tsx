import React from 'react';
import { View } from 'react-native';
import { ThemeConsumer } from '@wavemaker/app-rn-runtime/styles/theme';
import { DEFAULT_CLASS, WmOfflineBannerStyles } from './offline-banner.styles';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import WmButton from '../../basic/button/button.component';

interface OfflineBannerProps {
  onRetry: () => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = (props: OfflineBannerProps) => {

  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const appLocale = appConfig?.appLocale?.messages || {};

  return (
    <ThemeConsumer>
      {(theme) => {
        const styles = theme.getStyle(DEFAULT_CLASS) as WmOfflineBannerStyles;

        return (
          <View style={styles.root}>
            <View style={styles.imageContainer}>
              <WmPicture
                 picturesource={appConfig?.preferences?.offlineImage}
                 resizemode="contain"
                 name="offline_picture"
                 styles={{root: styles.offlineImage}}
                 />
            </View>
            <View style={styles.textContainer}>
              <WmLabel
                caption={appLocale.LABEL_OFFLINE_TITLE || appConfig?.preferences?.offlineTitle || 'Offline'}
                styles={{root: styles.message}}
                />
              <WmLabel
                caption={appLocale.MESSAGE_OFFLINE_DESCRIPTION || appConfig?.preferences?.offlineMessage || 'You are currently offline. Please check your internet connection.'}
                styles={{root: styles.subtitle}}
                />
            </View>
            <WmButton
              caption={appLocale.LABEL_OFFLINE_RETRY || appConfig?.preferences?.offlineRetry || 'Retry'}
              styles={{root: styles.retryButton}}
              onTap={() => {
                props.onRetry();
              }}
            />
          </View>
        );
      }}
    </ThemeConsumer>
  );
};

export default OfflineBanner;