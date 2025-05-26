import React from 'react';
import { isArray, isUndefined, isObject } from 'lodash-es';
import { Animated, Easing, View, LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { DefaultKeyExtractor } from '@wavemaker/app-rn-runtime/core/key.extractor';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import * as SwipeAnimation from '@wavemaker/app-rn-runtime/gestures/carousel-swipe.animation';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmCarouselProps from './carousel.props';
import { DEFAULT_CLASS, WmCarouselStyles } from './carousel.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmCarouselState extends BaseComponentState<WmCarouselProps> {
  activeIndex = 1;
}

export default class WmCarousel extends BaseComponent<WmCarouselProps, WmCarouselState, WmCarouselStyles> {

  noOfSlides: number = 0;
  private slidesLayout: LayoutRectangle[] = [];
  private keyExtractor = new DefaultKeyExtractor();
  stopPlay: Function = null as any;
  private dotPosition = new Animated.Value(0);
  private wrapperPosition = new Animated.Value(0);
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
      if(this.noOfSlides < this.state.activeIndex + 1){
        this.onSlideChange(1);
        this.animationView?.setPosition(0);
      }
      else{
        this.onSlideChange(this.state.activeIndex + 1);
      }
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
    if(!this.initialized){
      return;
    }
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

  stopAnimation(){  
    this.stopPlay();
  }
  startAnimation() {
      this.autoPlay();
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
    const props = this.state.props;
    const maxNoOfDots = this.state.props.maxnoofdots;
    const margin = ((this.styles.dotStyle?.marginLeft as number)|| 0) + 
    ((this.styles.dotStyle?.marginRight as number)|| 0)
    const width = (this.styles.dotStyle?.width as number)|| 2;
    const size = margin + width;
    const multiplier = this.isRTL ? -1 : 1;
    const options = {
      useNativeDriver: true,
      duration: 100,
      easing: Easing.out(Easing.linear),
    };
    let data = props.type === 'dynamic' ? props.dataset : props.children;
    const shouldAnimate = !(maxNoOfDots >= data?.length) && index > 3 && index <= data?.length - 2;
    if (shouldAnimate) {
      const newTranslateX = multiplier * -(index - 3) * (width + margin);
      Animated.timing(this.wrapperPosition, {
        toValue: newTranslateX,
        ...options,
      }).start();
    }
    if (index == 1 && prevIndex == data?.length) {
      Animated.timing(this.wrapperPosition, {
        toValue: 0,
        ...options,
      }).start();
    }   
    if (prevIndex < index || prevIndex > index) {
      Animated.timing(this.dotPosition, {
        toValue: multiplier * size * Math.max(index - 1, 0),
        ...options,
      }).start();
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
      return props.renderSlide ? props.renderSlide(item, index, this) : null;
    }
      const data= this.extractChildrenData(props.children)
      return data[index];
    
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
    const maxNoOfDots = data.length > 5 ? this.state.props.maxnoofdots : data.length;
    const activeIndex = this.state.activeIndex - 1;
    const dotMargin = ((this.styles.dotStyle?.marginLeft as number)|| 0) + 
    ((this.styles.dotStyle?.marginRight as number)|| 0);
    const wrapperWidth = (this.styles.dotStyle.width as any * maxNoOfDots) + (dotMargin * maxNoOfDots);
    let minIndex = Math.max(this.state.activeIndex - maxNoOfDots + 1, 0);
    let maxIndex = Math.min(minIndex + maxNoOfDots - 1, data.length);
    if (maxIndex === data.length) {
      minIndex = maxIndex - maxNoOfDots;
    }
    const dotStyle = this._showSkeleton ? {
      ...this.styles.dotStyle,
      ...this.styles.dotSkeleton.root
    } : this.styles.dotStyle
    return (<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={[this.styles.dotsWrapperStyle, { width: wrapperWidth }]}>
          <Animated.View
            style={{
              flexDirection: this.isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              transform: [{ translateX: this.wrapperPosition }],
            }}
          >
            {data.map((item: any, index: number) => {
              const isActive = index === activeIndex;
              let scale = 1;
              if (activeIndex <= 2) {
                scale = index <= 2 ? 1 : 1 - 0.1 * (index - 2);
              } else if (activeIndex >= data.length - 3) {
                  scale = index >= data.length - 3 ? 1 : 1 - 0.1 * ((data.length - 3) - index);
              } else {
                  scale = index === activeIndex ? 1 : (Math.abs(index - activeIndex) === 1 ? 0.9 : 0.8);
              }
              const animatedScale = new Animated.Value(scale);
              Animated.timing(animatedScale, {
                toValue: scale,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }).start();
              return (
                <Animated.View
                  key={'dots_' + this.generateItemKey(item, index, this.state.props)}
                  {...this.getTestPropsForAction('indicator' + index)}
                  style={[dotStyle,
                    isActive && this.styles.activeDotStyle,
                    {                
                      transform: [{scale: animatedScale}]
                    },
                  ]}
                />
              );
            })}
          </Animated.View>
        </View>
      </View>);
  }

  public renderSkeleton(props: WmCarouselProps): React.ReactNode | null {
    return <View style={[this.styles.root, {...this.styles.skeleton.root}]}>
       {this.renderItem({}, 0)}
      {this.renderPagination([{}, {}, {}])}
    </View>
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.autoPlay();
  }
    //Added below function to handle the case if the props.children has one object https://wavemaker.atlassian.net/browse/WMS-25986
  extractChildrenData = (data: any) => {
    if(Array.isArray(data)){
      return data;
    }
    if(data && isObject(data) && Object.keys(data).length > 0){
      return [data]
    }
    return [];
  }

  renderWidget(props: WmCarouselProps) {
    const hasNavs = props.controls === 'both' || props.controls ==='navs';
    const hasDots = props.controls === 'both' || props.controls ==='indicators';
    let styles = this.styles;
    let data = props.type === 'dynamic' ? props.dataset : props.children;
    data = this.extractChildrenData(data); 
    this.noOfSlides = data?.length || 0;
    let slideScale = undefined as any;
    let slideTranslateX = undefined as any;
    if (isArray(this.styles.slide?.transform)) {
      slideScale = (this.styles.slide?.transform?.find(o => !isUndefined((o as any).scale)) as any)?.scale;
      slideTranslateX = (this.styles.slide?.transform?.find(o => !isUndefined((o as any).translateX)) as any)?.translateX;
    }
    // TODO: loop prop on Carousel is not working Refer: https://github.com/meliorence/react-native-snap-carousel/issues/608
    return (
      <View 
        style={styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        <SwipeAnimation.View 
            enableGestures={props.enablegestures && this.noOfSlides > 1}
            style={{
              flex: 1
            }}
            direction='horizontal'
            threshold={this.state.props.threshold}
            ref={(r) => {this.animationView = r}}
            handlers = {this.animationHandlers}
            slideMinWidth={this.styles.slide.width}
            slidesLayout={this.slidesLayout}
            activeIndex={this.state.activeIndex}
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
                testID={`carousel_item_${index}`}
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
                <Tappable onTap={() => {
                  this.onSlideChange(index + 1);
                  const position = this.slidesLayout
                    .filter((l , i) => i < index)
                    .reduce((s, l) => s + l.width, 0);
                  this.animationView?.setPosition(-1 * position);
                }} rippleColor={this.styles.root.rippleColor} styles={{height: "100%"}}
                disableTouchEffect={this.state.props.disabletoucheffect}>
                  {this.renderItem(item, index)}
                </Tappable>
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
              onTap={this.prev}
              accessibilitylabel='back'/>
            <WmIcon
              id={this.getTestId('next_icon')}
              iconclass="wi wi-chevron-right fa-2x"
              styles={styles.nextBtn}
              onTap={this.next}
              accessibilitylabel='next'/>
          </View>): null}
          {hasDots && data ? this.renderPagination(data) : null}
      </View>);
  }
}
