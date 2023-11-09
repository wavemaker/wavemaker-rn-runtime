import React from 'react';
import { isArray } from 'lodash-es';
import { Animated, View, Text, LayoutChangeEvent, LayoutRectangle } from 'react-native';
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
  private slideLayout: LayoutRectangle = null as any;
  private keyExtractor = new DefaultKeyExtractor();
  stopPlay: Function = null as any;
  private animationView: SwipeAnimation.View | null = null as any;
  private animationHandlers = {
    bounds: (e) => {
      const activeTabIndex = this.state.activeIndex - 1,
            w = this.slideLayout?.width || 0,
            props = this.state.props,
            noOfTabs = props.type === 'dynamic' ? props.dataset : props.children;
      return {
        lower: -1 * (activeTabIndex - (activeTabIndex === 0 ? 0 : 1)) * w,
        center: -1 * activeTabIndex * w,
        upper:  -1 * (activeTabIndex + (activeTabIndex === noOfTabs - 1 ? 0 : 1)) * w
      };
    },
    computePhase: (value) => {
      const w = this.slideLayout?.width || 0;
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

  private generateItemKey(item: any, index: number, props: WmCarouselProps) {
    if (props.itemkey && item && !this._showSkeleton) {
      return props.itemkey(item, index);
    }
    return 'list_item_' +  this.keyExtractor.getKey(item, true);
  }

  setSlideLayout(event: LayoutChangeEvent) {
    this.slideLayout = event.nativeEvent.layout;
    this.forceUpdate();
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
            activeIndex: Math.min(this.state.activeIndex, $new?.length || 0)
          } as WmCarouselState);
          break;
        }
        case 'animation':
        case 'animationinterval' : {
          this.autoPlay();
        }
      }
  }

  onSlideChange = (index: number) => {
    const prevIndex = this.state.activeIndex;
    this.updateState({
      activeIndex: index
    } as WmCarouselState,
    () => this.invokeEventCallback('onChange', [this, index, prevIndex]));
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
      {
        data.map((item: any, index: number) => {
          return index >= minIndex && index <= maxIndex ? (
            <View key={'dots_' + this.generateItemKey(item, index, this.state.props)} 
              style={[
                this.styles.dotStyle,
                index === this.state.activeIndex - 1 ? this.styles.activeDotStyle: null]}>
            </View>) : null;
        })
      }
    </View>);
  }

  renderWidget(props: WmCarouselProps) {
    const hasNavs = props.controls === 'both' || props.controls ==='navs';
    const hasDots = props.controls === 'both' || props.controls ==='indicators';
    let styles = this.styles;
    let data = props.type === 'dynamic' ? props.dataset : props.children;
    data = isArray(data) ? data : [];
    this.noOfSlides = data?.length || 0;
    // TODO: loop prop on Carousel is not working Refer: https://github.com/meliorence/react-native-snap-carousel/issues/608
    return (
      <View style={styles.root} onLayout={this.setSlideLayout.bind(this)}>
        {this._background}
        <SwipeAnimation.View 
            enableGestures={props.enablegestures}
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
              height: props.type === 'dynamic' ? undefined : '100%',
            }}
            direction='horizontal'
            ref={(r) => {this.animationView = r}}
            handlers = {this.animationHandlers}
          >
          {data.map((item: any, index: number) => {
            const isActive = index === this.state.activeIndex - 1;
            let scale = this.animationView?.animationPhase.interpolate({
              inputRange: [-2000, index - 1, index, index + 1, 2000],
              outputRange: [0.8, 0.8, 1, 0.8, 0.8]
            });
            let translateX = this.animationView?.animationPhase.interpolate({
              inputRange: [-2000, index - 1, index, index + 1, 2000],
              outputRange: [-56, -56, 0, 56, 56]
            });
            return (
              <Animated.View key={this.generateItemKey(item, index, props)}
                style={[
                  {height: props.type === 'dynamic' ? undefined : '100%'},
                  this.styles.slide,
                  index === 0 ? this.styles.firstSlide : null,
                  index === data.length - 1 ? this.styles.lastSlide: null,
                  isActive ? this.styles.activeSlide: null,
                  translateX && scale ? {
                    transform: [
                      {
                        translateX: translateX
                      },
                      {
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
