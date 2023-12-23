import React from 'react';
import { isArray, isUndefined } from 'lodash-es';
import { Animated, Easing, View, LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { DefaultKeyExtractor } from '@wavemaker/app-rn-runtime/core/key.extractor';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import * as SwipeAnimation from '@wavemaker/app-rn-runtime/gestures/swipe.animation';

import WmCarouselProps from './carousel.props';
import { DEFAULT_CLASS, WmCarouselStyles } from './carousel.styles';

export class WmCarouselState extends BaseComponentState<WmCarouselProps> {
  activeIndex = 1;
}

export default class WmCarousel extends BaseComponent<WmCarouselProps, WmCarouselState, WmCarouselStyles> {

  noOfSlides: number = 0;
  private slidesLayout: LayoutRectangle[] = [];
  private keyExtractor = new DefaultKeyExtractor();
  stopPlay: Function = null as any;
  private dotScale = new Animated.Value(0);
  private dotPosition = new Animated.Value(0);
  private animationView: SwipeAnimation.View | null = null as any;
  private animationHandlers = {
    bounds: (e) => {
      const activeTabIndex = this.state.activeIndex - 1;
      let lower = 0;
      if (activeTabIndex > 0) {
        lower = this.slidesLayout
          .filter((l , i) => i < activeTabIndex - 1)
          .reduce((s, l) => s + l.width, 0);
      }
      let center = lower + (this.slidesLayout[activeTabIndex - 1]?.width || 0);
      let upper = center + (this.slidesLayout[activeTabIndex]?.width || 0);
      return {
        lower: -1 * lower,
        center: -1 * center,
        upper:  -1 * upper
      };
    },
    computePhase: (value) => {
      const activeTabIndex = this.state.activeIndex - 1;
      const w = this.slidesLayout[activeTabIndex]?.width || 0;
      return w && Math.abs(value / w);
    },
    onLower: (e) => {
      this.onSlideChange(this.state.activeIndex - 1);
    },
    onUpper: (e) => {
      this.onSlideChange(this.state.activeIndex + 1);
    }
  } as SwipeAnimation.Handlers;

  constructor(props: WmCarouselProps) {
    super(props, DEFAULT_CLASS, new WmCarouselProps(), new WmCarouselState());
    this.cleanup.push(() => {
      this.stopPlay && this.stopPlay();
    })
  }

  addSlideLayout(index: number, nativeEvent: LayoutChangeEvent) {
    this.slidesLayout[index] = nativeEvent.nativeEvent.layout;
    if (index === this.state.activeIndex) {
      this.forceUpdate();
    }
  }

  private generateItemKey(item: any, index: number, props: WmCarouselProps) {
    if (props.itemkey && item && !this._showSkeleton) {
      return props.itemkey(item, index);
    }
    return 'list_item_' +  this.keyExtractor.getKey(item, true);
  }

  autoPlay() {
    const props = this.state.props;
    this.stopPlay && this.stopPlay();
    if (props.animation === 'auto' && props.animationinterval) {
      const intervalId = setInterval(() => {
        this.next();
      }, props.animationinterval * 1000);
      this.stopPlay = () => clearInterval(intervalId);
    } else {
      setTimeout(() => {
        this.onSlideChange(1);
        this.animationView?.setPosition(0);
      }, 1000);
    }
  }

  onPropertyChange(name: string, $new: any, $old: any): void {
      super.onPropertyChange(name, $new, $old);
      switch (name) {
        case 'dataset': {
          this.keyExtractor?.clear();
          this.updateState({
            activeIndex: Math.min(this.state.activeIndex, $new?.length || 1)
          } as WmCarouselState);
          break;
        }
        case 'animation':
        case 'animationinterval' : {
          this.autoPlay();
        }
      }
  }

  animatePagination(index: number) {
    const prevIndex = this.state.activeIndex;
    const margin = ((this.styles.dotStyle?.marginLeft as number)|| 0) + 
    ((this.styles.dotStyle?.marginRight as number)|| 0)
    const width = (this.styles.dotStyle?.width as number)|| 2;
    const size = margin + width;
    const position = Math.max(index - 1, 0)  * size;
    const scale = Math.abs(index - prevIndex) * size;
    const options = {
      useNativeDriver: true,
      duration: 200,
      easing: Easing.out(Easing.linear)
    };
    if (prevIndex < index) {
      Animated.sequence([
        Animated.timing(this.dotScale, {
          toValue: scale,
          ...options
        }),
        Animated.parallel([
          Animated.timing(this.dotScale, {
              toValue:  0,
              ...options
          }),
          Animated.timing(this.dotPosition, {
              toValue:  (this.isRTL ? -1: 1) * position,
              ...options
          })
        ])
      ]).start();
    } else if (prevIndex > index) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.dotScale, {
              toValue:  scale,
              ...options
          }),
          Animated.timing(this.dotPosition, {
              toValue:  (this.isRTL ? -1: 1) * position,
              ...options
          })
        ]),
        Animated.timing(this.dotScale, {
          toValue: 0,
          ...options
        }),
      ]).start();
    } 
  }

  onSlideChange = (index: number) => {
    const prevIndex = this.state.activeIndex;
    this.updateState({
      activeIndex: index
    } as WmCarouselState,
    () => this.invokeEventCallback('onChange', [this, index, prevIndex]));
    this.animatePagination(index);
  }

  renderItem = (item: any, index: number) => {
    const props = this.state.props;
    if (props.type === 'dynamic') {
      return props.renderSlide ? props.renderSlide(item, index) : null;
    }
    return props.children[index];
  }

  next = () => {
    const props = this.state.props;
    const data = props.type === 'dynamic' ? props.dataset : props.children;
    if (this.state.activeIndex >= data?.length || 0) {
      this.onSlideChange(1);
      this.animationView?.setPosition(0);
    } else {
      this.animationView?.goToUpper();
    }
  }

  prev = () => {
    this.animationView?.goToLower();
  }

  renderPagination(data: any) {
    const maxNoOfDots = this.state.props.maxnoofdots;
    let minIndex = Math.max(this.state.activeIndex - maxNoOfDots + 1, 0);
    let maxIndex = Math.min(minIndex + maxNoOfDots - 1, data.length);
    if (maxIndex === data.length) {
      minIndex = maxIndex - maxNoOfDots;
    }
    return (<View style={this.styles.dotsWrapperStyle}>
      <View style={{flexDirection: this.isRTL ? 'row-reverse' : 'row'}}>
        {
          data.map((item: any, index: number) => {
            return index >= minIndex && index <= maxIndex ? (
              <View key={'dots_' + this.generateItemKey(item, index, this.state.props)} 
                style={[this.styles.dotStyle]}>
              </View>) : null;
          })
        }
        <Animated.View style={[
          this.styles.dotStyle,
          this.styles.activeDotStyle, {
            width: undefined,
            height: undefined,
            transform: [{
              translateX: this.dotPosition
            }]
          }, this.isRTL ? { right: 0 } : { left: 0}]}>
            <Animated.View style={[{
              width: 1,
              height: 1
            }, {
              // This is failing in Android
              // minWidth: this.dotScale
            }]}>
        </Animated.View>
        </Animated.View>
      </View>
    </View>);
  }

  renderWidget(props: WmCarouselProps) {
    const hasNavs = props.controls === 'both' || props.controls ==='navs';
    const hasDots = props.controls === 'both' || props.controls ==='indicators';
    let styles = this.styles;
    let data = props.type === 'dynamic' ? props.dataset : props.children;
    data = isArray(data) ? data : [];
    this.noOfSlides = data?.length || 0;
    let slideScale = undefined as any;
    let slideTranslateX = undefined as any;
    if (isArray(this.styles.slide?.transform)) {
      slideScale = (this.styles.slide?.transform?.find(o => !isUndefined((o as any).scale)) as any)?.scale;
      slideTranslateX = (this.styles.slide?.transform?.find(o => !isUndefined((o as any).translateX)) as any)?.translateX;
    }
    // TODO: loop prop on Carousel is not working Refer: https://github.com/meliorence/react-native-snap-carousel/issues/608
    return (
      <View style={styles.root}>
        {this._background}
        <SwipeAnimation.View 
            enableGestures={props.enablegestures}
            style={{
              height: props.type === 'dynamic' ? undefined : '100%',
            }}
            direction='horizontal'
            ref={(r) => {this.animationView = r}}
            handlers = {this.animationHandlers}
            slideMinWidth={this.styles.slide.width}
          >
          {data.map((item: any, index: number) => {
            const isActive = index === this.state.activeIndex - 1;
            let scale = this.animationView?.animationPhase.interpolate({
              inputRange: [-2000, index - 1, index, index + 1, 2000],
              outputRange: [slideScale, slideScale, 1, slideScale, slideScale]
            });
            let translateX = this.animationView?.animationPhase.interpolate({
              inputRange: [-2000, index - 1, index, index + 1, 2000],
              outputRange: [-56, -56, 0, 56, 56]
            });
            return (
              <Animated.View key={this.generateItemKey(item, index, props)}
                onLayout={this.addSlideLayout.bind(this, index)}
                onTouchEnd={() => {
                  this.onSlideChange(index + 1);
                  const position = this.slidesLayout
                    .filter((l , i) => i < index)
                    .reduce((s, l) => s + l.width, 0);
                  this.animationView?.setPosition(-1 * position);
                }}
                style={[
                  {height: props.type === 'dynamic' ? undefined : '100%'},
                  this.styles.slide,
                  index === 0 ? this.styles.firstSlide : null,
                  index === data.length - 1 ? this.styles.lastSlide: null,
                  isActive ? this.styles.activeSlide: null,
                  translateX && scale ? {
                    transform: [
                      {
                        translateX: !isUndefined(slideTranslateX) ? slideTranslateX : translateX
                      }, {
                        scale: scale
                      }
                    ]
                  } : null]}>
                {this.renderItem(item, index)}
              </Animated.View>
            );
          })}
        </SwipeAnimation.View>
        {hasNavs ? (
          <View style={styles.btnPanel}>
            <WmIcon
              id={this.getTestId('prev_icon')}
              iconclass="wi wi-chevron-left fa-2x"
              styles={styles.prevBtn}
              onTap={this.prev}/>
            <WmIcon
              id={this.getTestId('next_icon')}
              iconclass="wi wi-chevron-right fa-2x"
              styles={styles.nextBtn}
              onTap={this.next}/>
          </View>): null}
          {hasDots && data ? this.renderPagination(data) : null}
      </View>);
  }
}
