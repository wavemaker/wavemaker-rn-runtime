import React from 'react';
import { Text, View } from 'react-native';
import { ResizeMode, Video, AVPlaybackStatus } from 'expo-av';
import { VideoView, createVideoPlayer } from 'expo-video';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmVideoProps from './video.props';
import { DEFAULT_CLASS, WmVideoStyles } from './video.styles';
import { isString } from 'lodash-es';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

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

   handlePlaybackStatus = (status: AVPlaybackStatus) => {
    if ('isPlaying' in status && typeof status === 'object') {
      console.log(status.isPlaying? 'Playing' : 'Paused');
    } else if ('error' in status) {
      console.error(`Encountered a fatal error during playback: ${status.error}`);
    }
  };

  public renderSkeleton(props: WmVideoProps): React.ReactNode {
    return createSkeleton(this.theme, this.styles.skeleton , {
      ...this.styles.root
    });
  }

  renderWidget(props: WmVideoProps) {
    const player = createVideoPlayer({uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"})
    if(props.autoplay || true ) player.play()
    return (
      <View style={this.styles.root}>
        {this._background}
        {/* <Video
          {...getAccessibilityProps(AccessibilityWidgetType.VIDEO, props)}
          ref={(video) => { this.video = video; }}
          style={{ width: '100%', height: '100%', flex: 1 }}
          shouldPlay={props.autoplay}
          onPlaybackStatusUpdate={this.handlePlaybackStatus}
          source={this.getSource(
            props.mp4format
            || props.webmformat) as any}
          posterSource={ this.getSource(props.videoposter) as any }
          useNativeControls={props.controls}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={props.loop}
          isMuted={props.muted}
          testID={this.getTestId('video')}
        /> */}
        <VideoView 
          {...getAccessibilityProps(AccessibilityWidgetType.VIDEO, props)}
          // ref={(video) => { this.video = video; }}
          style={{ width: '100%', height: '100%', flex: 1 }}
          player={player}
          // statusChange={this.handlePlaybackStatus}
          // videoSource={this.getSource(props.mp4format || props.webmformat) as any}
          // videoSource={{uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
          // posterSource={ this.getSource(props.videoposter) as any } // not available
          nativeControls={props.controls}
          contentFit={'contain'}
          // loop={props.loop}
          // muted={props.muted}
          testID={this.getTestId('video')}
        />
      </View>); 
  }
}
