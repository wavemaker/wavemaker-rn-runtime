import React from 'react';
import Swiper from 'react-native-web-swiper';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCarouselProps from './carousel.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCarouselStyles } from './carousel.styles';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';

export class WmCarouselState extends BaseComponentState<WmCarouselProps> {
  activeIndex = 0;
}

export default class WmCarousel extends BaseComponent<WmCarouselProps, WmCarouselState, WmCarouselStyles> {

  constructor(props: WmCarouselProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCarouselProps(), new WmCarouselState());
  }

  getButtonComponent(iconclass: string, styles?: WmIconStyles) {
    return class extends React.Component {
      render() {
        return (<WmIcon iconclass={iconclass} styles={styles} onTap={() => (this.props as any).onPress()}></WmIcon>);
      }
    };
  }

  onSlideChange = (index: number) => {
    const prevIndex = this.state.activeIndex;
    this.updateState({
      activeIndex: index
    } as WmCarouselState,
    () => this.invokeEventCallback('onChange', [this, index, prevIndex]));
  };

  renderWidget(props: WmCarouselProps) {
    const loop = props.animation === 'auto';
    const hasNavs = props.controls === 'both' || props.controls ==='navs';
    const hasDots = props.controls === 'both' || props.controls ==='indicators';
    let styles = this.styles;
    if (!hasNavs) {
      styles = deepCopy(this.theme.getStyle('app-carousel-with-no-nav'), styles);
    }
    if (!hasDots) {
      styles = deepCopy(this.theme.getStyle('app-carousel-with-no-dots'), styles);
    }
    return (
      <Swiper
        loop={loop}
        timeout={(props.animationinterval || 0)}
        containerStyle={styles.root}
        innerContainerStyle={styles.innerContainerStyle}
        swipeAreaStyle={styles.swipeAreaStyle}
        slideWrapperStyle={styles.slideWrapperStyle}
        controlsEnabled={props.controls !== 'none'}
        onIndexChanged={this.onSlideChange}
        controlsProps={{
          PrevComponent: this.getButtonComponent('wi wi-chevron-left fa-2x', styles.prevBtn),
          NextComponent: this.getButtonComponent('wi wi-chevron-right fa-2x', styles.nextBtn),
          prevPos: 'left',
          nextPos: 'right',
          dotsTouchable: hasDots,
          dotsPos: 'bottom',
          dotsWrapperStyle: styles.dotWrapperStyle,
          dotProps: {
            badgeStyle: styles.dotStyle,
          },
          dotActiveStyle: styles.dotActiveStyle
        }}>
      {props.children}
      </Swiper>); 
  }
}
