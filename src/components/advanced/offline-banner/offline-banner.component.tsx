import React from 'react';
import {  Alert, View } from 'react-native';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { BaseComponent, BaseComponentState, BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import WmOfflineBannerProps from './offline-banner.props';
import { DEFAULT_CLASS, WmOfflineBannerStyles } from './offline-banner.styles';

class WMOfflineBannerState extends BaseComponentState<WmOfflineBannerProps> {}

class OfflineBanner extends BaseComponent<WmOfflineBannerProps, WMOfflineBannerState, WmOfflineBannerStyles> {
  constructor(props: WmOfflineBannerProps) {
    super(props, DEFAULT_CLASS, new WmOfflineBannerProps(), new WMOfflineBannerState());
  }

  renderWidget(props: WmOfflineBannerProps) {

    const appConfig = injector.get<AppConfig>('APP_CONFIG');
    const appLocale = appConfig?.appLocale?.messages || {};

    return  <View style={this.styles.root}>
    <View style={this.styles.imageContainer}>
      <WmPicture
         picturesource={appConfig?.preferences?.offlineImage}
         resizemode="contain"
         name="offline_picture"
         styles={this.styles.picture}
         />
    </View>
    <View style={this.styles.textContainer}>
      <WmLabel
        caption={appLocale.LABEL_OFFLINE_TITLE || appConfig?.preferences?.offlineTitle || 'No Internet connection'}
        styles={this.styles.message}
        />
      <WmLabel
        caption={appLocale.MESSAGE_OFFLINE_DESCRIPTION || appConfig?.preferences?.offlineMessage || 'You appear to be offline. Please check your internet connection.'}
        styles={this.styles.subtitle}
        />
    </View>
    <WmButton
      caption={appLocale.LABEL_OFFLINE_RETRY || appConfig?.preferences?.offlineRetry || 'Try Again'}
      styles={this.styles.retryButton}
      onTap={() => {
        props.onRetry();
      }}
    />
  </View>
     
  }
};

export default OfflineBanner;