import React from 'react';
import { Animated, Easing, LayoutChangeEvent, LayoutRectangle, Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabheaderProps from './tabheader.props';
import { DEFAULT_CLASS, WmTabheaderStyles } from './tabheader.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmSkeleton, { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';

export class WmTabheaderState extends BaseComponentState<WmTabheaderProps> {
}

export default class WmTabheader extends BaseComponent<WmTabheaderProps, WmTabheaderState, WmTabheaderStyles> {

  private headerPanelLayout: LayoutRectangle = null as any;
  private headersLayout: LayoutRectangle[] = [];
  private headerScrollPosition = new Animated.Value(0);
  private headerScrollPositionValue = 0;
  private indicatorPosition = new Animated.Value(0);
  private indicatorWidth = new Animated.Value(0);

  constructor(props: WmTabheaderProps) {
    super(props, DEFAULT_CLASS, new WmTabheaderProps(), new WmTabheaderState());
    this.headerScrollPosition.addListener(({value}) => this.headerScrollPositionValue = value);
  }

  setHeaderPanelPositon(nativeEvent: LayoutChangeEvent) {
    this.headerPanelLayout = nativeEvent.nativeEvent.layout;
  }

  setHeaderPositon(index: number, nativeEvent: LayoutChangeEvent) {
    this.headersLayout[index] = nativeEvent.nativeEvent.layout;
    if (index === this.props.selectedTabIndex) {
      this.forceUpdate();
    }
  }

  onTabSelection(index: number) {
    if (this.state.props.selectedTabIndex != index) {
      this.state.props.onIndexChange && this.state.props.onIndexChange(index);
    }
  }

  setPosition() {
    const selectedTabIndex = this.state.props.selectedTabIndex;
    let toIndicatorPosition = 0;
    let toIndicatorWidth = this.headersLayout[selectedTabIndex]?.width || 0;
    let toHeaderScrollPosition = this.headerScrollPositionValue;
    let totalWidth = 0;
    if (this.state.props.data.length !== this.headersLayout.length) {
      return;
    }
    this.headersLayout.forEach((p, i) => {
      if (i < selectedTabIndex) {
        toIndicatorPosition += p.width;
      }
      totalWidth += p.width;
    });
    toHeaderScrollPosition = -1 * (toIndicatorPosition - (this.headerPanelLayout?.width || 0) / 2 + toIndicatorWidth/ 2) ;
    const minScrollPosition = -1 * (totalWidth - (this.headerPanelLayout?.width || 0));
    const maxScrollPosition = 0;
    toHeaderScrollPosition = Math.max(minScrollPosition, toHeaderScrollPosition);
    toHeaderScrollPosition = Math.min(maxScrollPosition, toHeaderScrollPosition);
    Animated.parallel([
      Animated.timing(this.headerScrollPosition, {
        useNativeDriver: true,
        toValue:  toHeaderScrollPosition,
        duration: 200,
        easing: Easing.linear
      }),
      Animated.timing(this.indicatorWidth, {
        useNativeDriver: true,
        toValue:  toIndicatorWidth / 100,
        duration: 200,
        easing: Easing.linear
      }),
      Animated.timing(this.indicatorPosition, {
        useNativeDriver: true,
        toValue:  (toIndicatorPosition - (100 - toIndicatorWidth) / 2),
        duration: 200,
        easing: Easing.linear
      })
    ]).start();
  }

  public renderSkeleton(props: WmTabheaderProps){
    return(
      <Animated.View style={{
        transform: [{
          translateX: this.headerScrollPosition
        }]
      }}
      onLayout={this.setHeaderPanelPositon.bind(this)}>
        <View style={this.styles.root}>
          {this.props.data.map((header ,i) => {
            const isSelected = i === this.props.selectedTabIndex;
            return (
              <Tappable onTap={this.onTabSelection.bind(this, i)} key={header.key} styles={{flex: 1}}>
                <View onLayout={this.setHeaderPositon.bind(this, i)} style={[
                  this.styles.header, 
                  isSelected ? this.styles.activeHeader : null]}>
                  {
                    createSkeleton(this.theme, { root: { borderRadius: 4 }} as WmSkeletonStyles, {
                      ...this.styles.root,
                      width: this.styles.root?.width || "100%",
                      height: this.styles.root?.height || this.styles.activeHeaderText?.fontSize || 16
                    })
                  }
                </View>
              </Tappable>
            );
          })}
        </View>
        <Animated.View style={[this.styles.activeIndicator, {
          transform: [{
            translateX: this.indicatorPosition
          }, {
            scaleX: this.indicatorWidth
          }]
        }]}></Animated.View>
      </Animated.View>

    )
  }

  renderWidget(props: WmTabheaderProps) {
    this.setPosition();
    const activeIndicator = this.styles.activeIndicator as any;
    return (
      <Animated.View style={{
        transform: [{
          translateX: this.headerScrollPosition
        }]
      }}
      onLayout={this.setHeaderPanelPositon.bind(this)}>
        <View style={this.styles.root}>
          {this._background}
          {props.data.map((header ,i) => {
            const isSelected = i === props.selectedTabIndex ;
            return (
              <Tappable onTap={this.onTabSelection.bind(this, i)}
                key={header.key} 
                styles={this.styles.header.flexGrow ? {flexGrow: this.styles.header.flexGrow} : null}>
                <View onLayout={this.setHeaderPositon.bind(this, i)}>
                  <View style={[
                    this.styles.header,
                    {flexGrow: undefined},
                    isSelected ? this.styles.activeHeader : null]}>
                    <Text numberOfLines={1} style={[
                      this.styles.headerText, 
                      isSelected ? this.styles.activeHeaderText : null]}>{header.title}</Text>
                  </View>
                </View>
              </Tappable>
            );
          })}
        </View>
        <Animated.View style={[this.styles.activeIndicator, {
          transform: [{
            translateX: this.indicatorPosition
          }, {
            scaleX: this.indicatorWidth
          }]
        }]}>
          {activeIndicator.backgroundImage ? (<BackgroundComponent
            image={activeIndicator.backgroundImage}
            position={activeIndicator.backgroundPosition}
            size={activeIndicator.backgroundSize}
            repeat={activeIndicator.backgroundRepeat}
            resizeMode={activeIndicator.backgroundResizeMode}
            style={{borderRadius: this.styles.root.borderRadius}}
          ></BackgroundComponent>) : null }
          <View style={this.styles.arrowIndicator}>
            <View style={this.styles.arrowIndicatorDot}></View>
          </View>
        </Animated.View>
      </Animated.View>
    ); 
  }
}
