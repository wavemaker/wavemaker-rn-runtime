import React from 'react';
import { DimensionValue, Platform, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { isString } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmAudioProps from './audio.props';
import { DEFAULT_CLASS, WmAudioStyles } from './audio.styles';
import WmIcon from '../icon/icon.component';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { createSkeleton } from '../skeleton/skeleton.component';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';
import { AudioConsumer, AudioService } from '@wavemaker/app-rn-runtime/core/device/av-service';

export class WmAudioState extends BaseComponentState<WmAudioProps> {
  playing = false;
  currentTime = 0;
  totalTime = 0;
}

export default class WmAudio extends BaseComponent<WmAudioProps, WmAudioState, WmAudioStyles> {
  private loading = false;
  // private sound: Sound = null as any;
  private sound: any = null as any;
  private timer: any;
  private offsetTime = 0;
  private audioService: AudioService = null as any;

  constructor(props: WmAudioProps) {
    super(props, DEFAULT_CLASS, new WmAudioProps(), new WmAudioState());
  }

  onPropertyChange(name: string, $new: any, $old: any): void {
      super.onPropertyChange(name, $new, $old);
      switch(name) {
        case 'mp3format': {
          if (this.initialized) {
            Promise.resolve()
              .then(() => this.sound?.unloadAsync())
              .then(() => {
                this.sound = null as any;
                this.onSeekChange(0);
                if (this.state.playing 
                  || this.state.props.autoplay) {
                  this.play();
                }
              });
          }
        }
        break;
        case 'autoplay':
          if (this.initialized && $new) {
            this.play();
          }
      }
  }

  getSource() {
    const source = this.loadAsset 
      && this.state.props.mp3format
      && this.loadAsset(this.state.props.mp3format as string);
    if (isString(source)) {
      return {
        uri: source
      };
    }
    return source;
  }

  addPadding(str: string, maxLen: number,  pad = '0'): string {
    if (str.length < maxLen) {
      return this.addPadding(pad + str, maxLen, pad);
    }
    return str;
  }

  formatTime(v: number) {
    const t = v/60;
    const mins =  Math.floor(t);
    const seconds = Math.round((t - mins) * 60);
    return this.addPadding(mins+ '', 2) + ':' + this.addPadding(seconds+ '', 2);
  }

  setTimer() {
    this.cancelTimer();
    this.timer = setInterval(() => {
      if (this.state.currentTime >= this.state.totalTime) {
        if (this.state.props.loop) {
          this.replay();
        } else {
          this.stop();
        }
        return;
      }
      this.setState({
        currentTime:  Math.max(this.offsetTime + this.state.currentTime + 1, 0)
      } as WmAudioState);
      this.offsetTime = 0;
    }, 1000);
  }

  cancelTimer() {
    clearInterval(this.timer);
  }

  stop() {
    this.pause();
    this.sound?.unloadAsync();
    this.sound = null as any;
    this.cancelTimer();
    this.offsetTime = 0;
    this.updateState({
      currentTime: 0
    } as WmAudioState);
  }

  replay() {
    this.updateState({
      currentTime: 0
    } as WmAudioState, () => {
      this.sound.replayAsync();
    });
  }

  play() {
    if (isWebPreviewMode() 
      || this.loading
      || (this.state.playing && this.sound)) {
      return;
    }
    if (this.sound) {
      this.sound.playAsync();
      this.setTimer();
      this.updateState({
        playing: true
      } as WmAudioState);
    } else {
      this.loading = true;
      const source = this.getSource();
      source && this.audioService.createAudio(source, {
        isMuted: this.state.props.muted
      })
        .then((res: any) => {
          this.sound = res.sound;
          this.sound.playAsync();
          this.sound.getStatusAsync().then((status: any) => {
            this.updateState({
              currentTime: 0,
              totalTime: Math.round(status['durationMillis']/1000)
            } as WmAudioState, () => this.setTimer());
          });
          this.updateState({
            playing: true
          } as WmAudioState);
        }).catch(() => {}).then(() => {
          this.loading = false;
        });
    }
  }

  pause() {
    this.cancelTimer();
    this.sound?.pauseAsync().then(() => {
      this.updateState({
        playing: false
      } as WmAudioState);
    })
  }

  mute() {
    this.sound.setStatusAsync({
      isMuted: true
    }).then(() => {
      this.updateState({
        props: {
          muted: true
        }
      } as WmAudioState);
    });
  }

  unmute() {
    this.sound.setStatusAsync({
      isMuted: false
    }).then(() => {
      this.updateState({
        props: {
          muted: false
        }
      } as WmAudioState);
    });
  }

  onSeekChange(time: number) {
    if (time !== this.state.currentTime) {
      this.offsetTime = time - this.state.currentTime;
      this.sound?.setPositionAsync(time * 1000);
    }
  }

  componentDidMount(): void {
    super.componentDidMount();
    //without settimeout, app is crashing with errors
    setTimeout(() => {
      if (this.state.props.autoplay) {
        this.play();
      }
    }, 1000);
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.stop();
  }

  public renderTextSkeleton(): React.ReactNode {
      return (
        createSkeleton(this.theme, {} as WmSkeletonStyles, {
          ...this.styles.text,
          ...this.styles.textSkeleton.root
        })
      )
  } 
  renderWidget(props: WmAudioProps) {
    return props.controls ? (
      <AudioConsumer>
      {(audioService: any) => {
        this.audioService = audioService;
        return <View 
        style={this.styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        {!this.state.playing ? (<WmIcon 
          id={this.getTestId('play')}
          name={props.name + "_play"}
          styles={this.styles.playIcon}
          iconclass="wi wi-play-arrow fa-2x"
          onTap={() => this.play()}></WmIcon>) : (
        <WmIcon name={props.name + "_pause"}
          id={this.getTestId('pause')}
          iconclass="wi wi-pause fa-2x"
          styles={this.styles.pauseIcon}
          onTap={() => this.pause()}></WmIcon>)}
        {
          this._showSkeleton ? this.renderTextSkeleton() : 
          <>
            <Text style={this.styles.text}>
            {`${this.formatTime(this.state.currentTime)} / ${this.formatTime(this.state.totalTime)}`}
            </Text>
            <Slider
            testID={this.getTestId('slider')}
            step={1}
            style={{flex: 1}}
            value={this.state.currentTime}
            disabled={isWebPreviewMode()}
            onValueChange={this.onSeekChange.bind(this)}
            minimumValue={0}
            inverted={this.isRTL && (Platform.OS=="android" || Platform.OS=="web")}
            maximumValue={this.state.totalTime || 1}
            thumbTintColor={this.styles.slider.thumb.backgroundColor as string}
            minimumTrackTintColor={this.styles.slider.minimumTrack.backgroundColor as string}
            maximumTrackTintColor={this.styles.slider.maximumTrack.backgroundColor as string}
            />
          </>
        }
        {!props.muted ? (<WmIcon name={props.name + "_mute"}
          id={this.getTestId('mute')}
          iconclass="wi wi-volume-up fa-2x"
          styles={this.styles.muteIcon}
          onTap={() => this.mute()}></WmIcon>) :
        (<WmIcon name={props.name + "_unmute"}
          id={this.getTestId('unmute')}
          iconclass="wi wi-volume-off fa-2x"
          styles={this.styles.unmuteIcon}
          onTap={() => this.unmute()}></WmIcon>)}
      </View>
      }}
      </AudioConsumer>) : null; 
  }
}
