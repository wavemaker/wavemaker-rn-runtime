import React from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { VideoView, createVideoPlayer } from 'expo-video';
import {
  BaseComponent,
  BaseComponentState,
} from '@wavemaker/app-rn-runtime/core/base.component';
import WmVideoProps from './video.props';
import { DEFAULT_CLASS, WmVideoStyles } from './video.styles';
import {
  AccessibilityWidgetType,
  getAccessibilityProps,
} from '@wavemaker/app-rn-runtime/core/accessibility';
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmVideoState extends BaseComponentState<WmVideoProps> {
  isVideoReady: boolean = false;
  playStarted: boolean = false;
}

export default class WmVideo extends BaseComponent<
  WmVideoProps,
  WmVideoState,
  WmVideoStyles
> {
  private player: any;

  constructor(props: WmVideoProps) {
    super(props, DEFAULT_CLASS, new WmVideoProps(), new WmVideoState());
  }

  getSource(path: string, type: string) {
    if (!path) {
      return null;
    }
    const resource = this.loadAsset && this.loadAsset(path);
    if (isFullPathUrl(resource as string)) {
      return {
        uri: path,
      };
    }
    if (type == 'poster') return Number(resource);
    return {
      assetId: Number(resource) || 0,
    };
  }

  

  handlePlaybackStatus = (status: any) => {
    if ('isPlaying' in status && typeof status === 'object') {
      console.log(status.isPlaying ? 'Playing' : 'Paused');
    } else if ('error' in status) {
      console.error(
        `Encountered a fatal error during playback: ${status.error}`
      );
    }
  };

  renderVideoPoster(props: WmVideoProps) {
    return (
      <TouchableWithoutFeedback onPress={() => this.player.play()}>
        <Image
          {...this.getTestProps('video_poster')}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
          }}
          resizeMode={'cover'}
          source={this.getSource(props.videoposter, 'poster') as any}
          {...getAccessibilityProps(AccessibilityWidgetType.PICTURE, props)}
        />
      </TouchableWithoutFeedback>
    );
  }

  public renderSkeleton(props: WmVideoProps): React.ReactNode {
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
    });
  }

  public playingStatusChange(isPlaying: boolean) {
    if (!this.state.playStarted) {
      this.updateState({
        playStarted: isPlaying,
      } as WmVideoState);
    }
  }

  playerReadyStatusChange(status: string) {
    this.updateState({
      isVideoReady: status == 'readyToPlay',
    } as WmVideoState);
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.getSource(this.state.props.videoposter, 'poster')
    const { mp4format, webmformat, autoplay } = this.state.props;
    const videoSource = this.getSource(mp4format || webmformat, 'video') || {
      uri: '',
    };
    this.player = createVideoPlayer(videoSource);
    if (autoplay) this.player.play();

    this.player.addListener(
      'playingChange',
      this.playingStatusChange.bind(this)
    );
    this.player.addListener(
      'statusChange',
      this.playerReadyStatusChange.bind(this)
    );
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.player.removeListener('playingChange', this.playingStatusChange);
    this.player.removeListener('statusChange', this.playerReadyStatusChange);
    this.player.release();
  }

  renderWidget(props: WmVideoProps) {
    const {
      isLive,
      loop,
      muted,
      playing,
      showNowPlayingNotification,
      allowsPictureInPicture,
      videoposter,
      onFullscreenEnter,
      onFullscreenExit,
      requiresLinearPlayback,
    } = props;

    const { playStarted, isVideoReady } = this.state;

    return (
      <View style={this.styles.root}>
        {this._background}
        <VideoView
          {...getAccessibilityProps(AccessibilityWidgetType.VIDEO, props)}
          style={{ width: '100%', height: '100%', flex: 1 }}
          player={this.player}
          nativeControls={props.controls}
          contentFit={'contain'}
          loop={loop}
          muted={muted}
          testID={this.getTestId('video')}
          allowsPictureInPicture={allowsPictureInPicture}
          onFullscreenEnter={onFullscreenEnter}
          onFullscreenExit={onFullscreenExit}
          requiresLinearPlayback={requiresLinearPlayback}
          isLive={isLive}
          playing={playing}
          showNowPlayingNotification={showNowPlayingNotification}
        />
        {!playStarted && !isVideoReady && videoposter ? (
          this.renderVideoPoster(props)
        ) : (
          <></>
        )}
      </View>
    );
  }
}
