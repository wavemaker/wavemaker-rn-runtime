import React from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCarouselProps from './carousel.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCarouselStyles } from './carousel.styles';

export class WmCarouselState extends BaseComponentState<WmCarouselProps> {
  activeIndex = 0;
  sliderWidth = 0;
}

export default class WmCarousel extends BaseComponent<WmCarouselProps, WmCarouselState, WmCarouselStyles> {

  carouselRef: Carousel<unknown> | null = null as any;
  noOfSlides: number = 0;
  stopPlay: Function = null as any;

  constructor(props: WmCarouselProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCarouselProps(), new WmCarouselState());
    this.cleanup.push(() => {
      this.stopPlay && this.stopPlay();
    })
  }

  autoPlay() {
    const props = this.state.props;
    this.stopPlay && this.stopPlay();
    if (props.animation && props.animationinterval) {
      const intervalId = setInterval(() => {
        this.next();
      }, props.animationinterval * 1000);
      this.stopPlay = () => clearInterval(intervalId);
    }
  }

  onPropertyChange(name: string, $new: any, $old: any): void {
      super.onPropertyChange(name, $new, $old);
      switch (name) {
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

  renderItem = (data: any) => {
    const props = this.state.props;
    if (props.type === 'dynamic') {
      return props.renderSlide ? props.renderSlide(data.item, data.index) : null;
    }
    return props.children[data.index];
  }

  onLayoutChange = (e: LayoutChangeEvent) => {
    this.updateState({
      sliderWidth: e.nativeEvent.layout.width
    } as WmCarouselState);
  }

  getDotElement = ({active, index}: {active: boolean, index: number}) => {
    return (<Text style={active ? this.styles.activeDotStyle: this.styles.dotStyle}>{index}</Text>);
  }

  renderPagination(props: WmCarouselProps, styles: WmCarouselStyles) {
    return (
        <Pagination
          carouselRef={this.carouselRef as any}
          dotsLength={this.noOfSlides}
          activeDotIndex={this.state.activeIndex}
          containerStyle={styles.dotsWrapperStyle}
          dotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.dotStyle}
          inactiveDotScale={0.8}
          tappableDots={true}
        />
    );
  }

  next = () => {
    if (this.carouselRef && this.carouselRef.currentIndex < this.noOfSlides - 1) {
      this.carouselRef?.snapToNext();
    } else {
      this.carouselRef?.snapToItem(0);
    }
  }

  prev = () => {
    if (this.carouselRef && this.carouselRef.currentIndex > 0) {
      this.carouselRef?.snapToPrev();
    } else {
      this.carouselRef?.snapToItem(this.noOfSlides - 1);
    }
  }

  renderWidget(props: WmCarouselProps) {
    const hasNavs = props.controls === 'both' || props.controls ==='navs';
    const hasDots = props.controls === 'both' || props.controls ==='indicators';
    let styles = this.styles;
    const data = props.type === 'dynamic' ? props.dataset : props.children;
    this.noOfSlides = data?.length || 0;
    const autoPlay = props.animation === 'auto';
    // TODO: loop prop on Carousel is not working Refer: https://github.com/meliorence/react-native-snap-carousel/issues/608
    return (
      <View style={styles.root} onLayout={this.onLayoutChange}>
        {this.state.sliderWidth > 0 ?
          (<Carousel
            ref={ref => this.carouselRef = ref}
            data={data}
            firstItem={0}
            style={{width: '100%', height: '100%'}}
            enableSnap={true}
            loopClonesPerSide={1}
            autoplay={false}
            activeSlideAlignment='start'
            renderItem={this.renderItem}
            sliderWidth={this.state.sliderWidth}
            itemWidth={this.state.sliderWidth}
            lockScrollWhileSnapping={false}
            scrollEnabled={false}
            onSnapToItem={this.onSlideChange}
          ></Carousel>) : null}
        {hasNavs ? (
          <View style={styles.btnPanel}>
            <WmIcon
              iconclass="wi wi-chevron-left fa-2x"
              styles={styles.prevBtn}
              onTap={this.prev}/>
            <WmIcon
              iconclass="wi wi-chevron-right fa-2x"
              styles={styles.nextBtn}
              onTap={this.next}/>
          </View>): null}
        {this.state.sliderWidth > 0 && hasDots && data ? this.renderPagination(props, styles) : null}
      </View>);
  }
}
