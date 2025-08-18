import React from 'react';
import { View } from 'react-native';
import { ThemeConsumer } from '@wavemaker/app-rn-runtime/styles/theme';
import { DEFAULT_CLASS, WmOfflineBannerStyles } from './offline-banner.styles';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';

export interface WmOfflineBannerProps {
  /** Custom message to show */
  message?: string;
}

const OfflineBanner: React.FC<WmOfflineBannerProps> = (props) => {
  const {
    message = 'No Internet Connection'
  } = props;

  const appConfig = injector.get<AppConfig>('APP_CONFIG');

  return (
    <ThemeConsumer>
      {(theme) => {
        const styles = theme.getStyle(DEFAULT_CLASS) as WmOfflineBannerStyles;
        const offlineImageSource = appConfig?.preferences?.offlineImage;

        return (
          <View style={styles.root}>
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                  <WmPicture
                    picturesource={offlineImageSource}
                    resizemode="contain"
                    name="offline_picture"
                    classname="offline-banner-image"
                  />
                </View>
                <View style={styles.textContainer}>
                  <WmLabel
                    caption={message}
                    classname="offline-banner-message"
                  />
                  <WmLabel
                    caption="You appear to be offline. Please check your internet connection."
                    classname="offline-banner-subtitle"
                  />
                </View>
              </View>
            </View>
          </View>
        );
      }}
    </ThemeConsumer>
  );
};

export default OfflineBanner;