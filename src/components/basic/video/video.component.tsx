import React from 'react';
import { Text, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmVideoProps from './video.props';
import { DEFAULT_CLASS, WmVideoStyles } from './video.styles';
import { isString } from 'lodash-es';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';

export class WmVideoState extends BaseComponentState<WmVideoProps> {}

export default class WmVideo extends BaseComponent<WmVideoProps, WmVideoState, WmVideoStyles> {

  private video: Video | null = null as any;

  constructor(props: WmVideoProps) {
    super(props, DEFAULT_CLASS, new WmVideoProps(), new WmVideoState());
  }

  getSource(path: string) {
    if (!path) {
      return null;
    }
    const resource = this.loadAsset(path);
    if (isFullPathUrl(resource as string)) {
      return {
        uri: resource
      };
    }
    return resource;
  }

  componentDidMount(): void {
    if (this.state.props.autoplay) {
      this.video?.playAsync();
    }
  }

  renderWidget(props: WmVideoProps) {
    return (
      <View style={this.styles.root}>
        {this._background}
        <Video
          {...getAccessibilityProps(AccessibilityWidgetType.VIDEO, props)}
          ref={(video) => { this.video = video; }}
          style={{ width: '100%', height: '100%', flex: 1 }}
          source={this.getSource(
            props.mp4format
            || props.webmformat) as any}
          posterSource={ this.getSource(props.videoposter) as any }
          useNativeControls={props.controls}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={props.loop}
          isMuted={props.muted}
          testID={this.getTestId('video')}
        />
      </View>); 
  }
}
