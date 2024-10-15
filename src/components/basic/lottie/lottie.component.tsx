import React from 'react';
import axios from 'axios';
import { Platform, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLottieProps from './lottie.props';
import { DEFAULT_CLASS, WmLottieStyles } from './lottie.styles';

export class WmLottieState extends BaseComponentState<WmLottieProps> {
  animationData: any;
  isCompleted = false;
}

export default class WmLottie extends BaseComponent<WmLottieProps, WmLottieState, WmLottieStyles> {

  private lottie = React.createRef<LottieView>();

  constructor(props: WmLottieProps) {
    super(props, DEFAULT_CLASS, new WmLottieProps(), new WmLottieState());
  }
  
  play() {
    if (this.lottie.current) {
      if (this.state.isCompleted) {
        this.reset();
      } else {
        this.lottie.current.play();
        this.invokeEventCallback('onPlay', [null, this.proxy]);
      }
    }
  }

  pause() {
    if (this.lottie.current) {
      this.lottie.current.pause();
      this.invokeEventCallback('onPause', [null, this.proxy]);
    }
  }

  reset() {
    if (this.lottie.current) {
      if (this.lottie.current.reset) {
        this.lottie.current.reset();
        this.lottie.current.play();
      } else if((this.lottie.current as any).goToAndPlay) {
        (this.lottie.current as any).goToAndPlay(0);
      } else {
        return;
      }
      this.invokeEventCallback('onPlay', [null, this.proxy]);
      this.updateState({
        isCompleted: false
      } as WmLottieState);
    }
    
  }

  private onReady() {
    this.invokeEventCallback('onReady', [null, this.proxy]);
    if (this.state.props.autoplay) {
      this.invokeEventCallback('onPlay', [null, this.proxy]);
    }
  }

  private loadAnimationData() {
    if (this.state.animationData || ! this.loadAsset) {
      return;
    }
    if (Platform.OS == 'web') {
      const url = this.loadAsset(this.state.props.source) as string;
      axios.get(url).then(({data}) => {
        this.updateState({
          animationData: data
        } as WmLottieState, () => this.onReady());
      });
    } else {
      this.updateState({
        animationData: this.loadAsset(this.state.props.source)
      } as WmLottieState, () => this.onReady());
    }
  }

  onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'src':
        this.loadAnimationData();
        break;
      case 'loop':
        if (this.initialized && 
          !this.state.isCompleted && 
          ($new || this.state.props.autoplay)) {
          setTimeout(() => this.reset(), 200);
        }
        break;
    }
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.loadAnimationData();
  }

  private renderWebLottie(props: WmLottieProps) {
    const Lottie = require('react-lottie-player');
    return (<Lottie 
      animationData={this.state.animationData}
      ref= {this.lottie}
      loop={props.loop}
      play={props.autoplay}
      speed={props.speed}
      style={this.styles.content}
      onComplete={() => {
        this.updateState({
          isCompleted: true
        } as WmLottieState);
        this.invokeEventCallback('onComplete', [null, this.proxy]);
      }}/>);
  }

  private renderNativeLottie(props: WmLottieProps) {
    return (
      <LottieView
          source={this.state.animationData}
          ref= {this.lottie}
          autoPlay={props.autoplay}
          speed={props.speed}
          loop={props.loop}
          style={this.styles.content}
          onAnimationFinish={() => {
            this.updateState({
              isCompleted: true
            } as WmLottieState);
            this.invokeEventCallback('onComplete', [null, this.proxy]);
          }}
        />
    );
  }

  renderWidget(props: WmLottieProps) {
    return (
      <View style={this.styles.root}>
        {this._background}
        {this.state.animationData ? 
          (Platform.OS == 'web' ?  this.renderWebLottie(props) : this.renderNativeLottie(props)) 
          : null 
        }
      </View>); 
  }
}
