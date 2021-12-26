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

  constructor(props: WmCarouselProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCarouselProps(), new WmCarouselState());
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

  renderPagination(length: number, props: WmCarouselProps, styles: WmCarouselStyles) {
    return (
        <Pagination
          carouselRef={this.carouselRef as any}
          dotsLength={length}
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
    this.carouselRef?.snapToNext();
  }

  prev = () => {
    this.carouselRef?.snapToPrev();
  }

  renderWidget(props: WmCarouselProps) {
    const hasNavs = props.controls === 'both' || props.controls ==='navs';
    const hasDots = props.controls === 'both' || props.controls ==='indicators';
    let styles = this.styles;
    const data = props.type === 'dynamic' ? props.dataset : props.children;
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
            autoplay={autoPlay}
            activeSlideAlignment='start'
            autoplayDelay={(props.animationinterval || 1) * 1000}
            autoplayInterval={(props.animationinterval || 1) * 1000}
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
        {this.state.sliderWidth > 0 && hasDots && data ? this.renderPagination(data.length, props, styles) : null}
      </View>);
  }
}
