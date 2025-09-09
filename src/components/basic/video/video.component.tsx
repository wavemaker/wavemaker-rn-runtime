import React from 'react';
import { View, Image, TouchableWithoutFeedback, Platform, Text } from 'react-native';
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
import { VideoConsumer } from '@wavemaker/app-rn-runtime/core/device/av-service';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

export class WmVideoState extends BaseComponentState<WmVideoProps> {
  isVideoReady: boolean = false;
  playStarted: boolean = false;
  videoPosterDismissed: boolean = false;
}

export default class WmVideo extends BaseComponent<
  WmVideoProps,
  WmVideoState,
  WmVideoStyles
> {
  private player: any;
  private videoService: any = null as any;

  constructor(props: WmVideoProps) {
    super(props, DEFAULT_CLASS, new WmVideoProps(), new WmVideoState());
  }

  getSource(path: string) {
    if (!path) {
      return null;
    }
    const resource = this.loadAsset && this.loadAsset(path);
    if (isFullPathUrl(resource as string)) {
      return {
        uri: resource as string,
      };
    }
    return resource || {
      uri: ''
    };
  }

  renderVideoPoster(props: WmVideoProps) {
    const accessibilityImageProps = {...props, 
      accessibilitylabel : `${props.accessibilitylabel}_poster`,
      hint: `${props.hint}_poster`,
      accessibilityrole: 'image'
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.player?.play()} >
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
          source={this.getSource(props.videoposter) as any}
          {...getAccessibilityProps(AccessibilityWidgetType.PICTURE, accessibilityImageProps)}
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
        playStarted: this.state.props.autoplay || isPlaying,
      } as WmVideoState);
    }
  }

  playerReadyStatusChange(statusObj: any) {
    const videoReady = statusObj.status === 'readyToPlay'
    if (this.state.props.autoplay && videoReady) {
        this.player.play();
    }
    this.updateState({
      isVideoReady: videoReady,
    } as WmVideoState);
  }

  initializeProps(){
    const {
      loop,
      muted,
      showNowPlayingNotification,
    } = this.state.props

    this.player.muted = muted; 
    this.player.loop = loop; 
    this.player.showNowPlayingNotification = showNowPlayingNotification; 
  }

  componentDidMount(): void {
    super.componentDidMount();
    const { mp4format, webmformat, autoplay } = this.state.props;
    const videoSource = this.getSource(mp4format || webmformat) ;

    this.player = this.videoService?.createVideoPlayer(videoSource);
    this.player.addListener(
      'playingChange',
      this.playingStatusChange.bind(this)
    );
    this.player.addListener(
      'statusChange',
      this.playerReadyStatusChange.bind(this)
    ); 
    this.initializeProps()
  }

  onPlayIconTap() {
    this.updateState({
      videoPosterDismissed: true
    } as WmVideoState)
    this.player.play()
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.player.removeListener('playingChange', this.playingStatusChange);
    this.player.removeListener('statusChange', this.playerReadyStatusChange);
    this.player.release();
  }

  //TASK: Overlay on video widged should be removed once upgraded to expo 53.

  renderWidget(props: WmVideoProps) {
    const {
      allowsPictureInPicture,
      videoposter,
      onFullscreenEnter,
      onFullscreenExit,
      requiresLinearPlayback,
      showdefaultvideoposter
    } = props;

    const { playStarted } = this.state;
    const isPlaying = playStarted || this.state.props.autoplay;
    const showOverlay = !showdefaultvideoposter && !this.state.videoPosterDismissed

    
    return (
      <VideoConsumer>
      {(videoService: any) => {
        this.videoService = videoService;
        const VideoView = videoService?.VideoView;
        return (
          <View 
        style={this.styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        <VideoView
          {...getAccessibilityProps(AccessibilityWidgetType.VIDEO, props)}
          style={{ width: '100%', height: '100%', flex: 1 }}
          player={this.player}
          nativeControls={props.controls || showOverlay}
          contentFit={'contain'}
          testID={this.getTestId('video')}
          allowsPictureInPicture={allowsPictureInPicture}
          onFullscreenEnter={onFullscreenEnter}
          onFullscreenExit={onFullscreenExit}
          requiresLinearPlayback={requiresLinearPlayback}
        />
        {Platform.OS === 'android' && !(props.controls && showOverlay ) && <Tappable onTap={() => {}} styles={{zIndex: 10, position:"absolute", width: '100%', height: '100%', flex: 1 }}>
          <View testID={this.getTestId('video_overlay')} style={{backgroundColor:'transparent', width: '100%', height: '100%', flex: 1}}>
          </View>
        </Tappable>}
<<<<<<< HEAD

=======
>>>>>>> parent of 3ed89a5f ("Feat: remove unused plugins ~ WMS-25658")
        {!isPlaying && videoposter && showdefaultvideoposter ? (
          this.renderVideoPoster(props)
        ) : (
          <></>
        )}
<<<<<<< HEAD
        
=======
>>>>>>> parent of 3ed89a5f ("Feat: remove unused plugins ~ WMS-25658")
        {
          !isPlaying && !showdefaultvideoposter && !this.state.videoPosterDismissed ? (
            <View style={this.styles.playIconContainer}>
              <TouchableWithoutFeedback style={{width: 80, height: 80 }} onPress={this.onPlayIconTap.bind(this)}>
                {Platform.OS === 'android' ? <Image
                {...this.getTestProps('video_play_button')}
                style={{
                  width: 80, 
                  height: 80,
                }}
                resizeMode={'contain'}
                source={this.getSource('resources/images/imagelists/play.png') as any}
              /> : <Text style={{ fontSize: 80, fontWeight: 'bold', color: 'white'}} >▶</Text> } 
              </TouchableWithoutFeedback>
            </View>            
          ) : (
            <></>
          )
        }
      </View>
        )}}
      </VideoConsumer>
    );
  }
}