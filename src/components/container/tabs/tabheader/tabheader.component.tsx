import React from 'react';
import { Animated, Easing, LayoutChangeEvent, LayoutRectangle, Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTabheaderProps from './tabheader.props';
import { DEFAULT_CLASS, WmTabheaderStyles } from './tabheader.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmSkeleton, { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";


export class WmTabheaderState extends BaseComponentState<WmTabheaderProps> {
}

export default class WmTabheader extends BaseComponent<WmTabheaderProps, WmTabheaderState, WmTabheaderStyles> {

  private headerPanelLayout: LayoutRectangle = null as any;
  private headersLayout: LayoutRectangle[] = [];
  private headerScrollPosition = new Animated.Value(0);
  private headerScrollPositionValue = 0;
  private indicatorPosition = new Animated.Value(0);
  private reverseIndicatorWidth = new Animated.Value(0);
  private indicatorWidth = new Animated.Value(0);

  constructor(props: WmTabheaderProps) {
    super(props, DEFAULT_CLASS, new WmTabheaderProps(), new WmTabheaderState());
    this.headerScrollPosition.addListener(({value}) => this.headerScrollPositionValue = value);
  }

  setHeaderPanelPositon(nativeEvent: LayoutChangeEvent) {
    this.headerPanelLayout = nativeEvent.nativeEvent.layout;
    this.forceUpdate();
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
    let positionIndicator = (toIndicatorPosition - (100 - toIndicatorWidth) / 2);
    let position = this.isRTL?-positionIndicator:positionIndicator;
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
      Animated.timing(this.reverseIndicatorWidth, {
        useNativeDriver: true,
        toValue:  toIndicatorWidth ? 100 / toIndicatorWidth : 0,
        duration: 200,
        easing: Easing.linear
      }),
      Animated.timing(this.indicatorPosition, {
        useNativeDriver: true,
        toValue:  position,
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
                      width: this.styles.root?.width || "80%",
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
    const arrowIndicator = this.styles.arrowIndicator as any;
    return (
      <View style={{overflow: 'hidden', zIndex: 16}}>
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
                {...this.getTestPropsForAction(i +'')}
                key={header.key} 
                styles={this.styles.header.flexGrow ? {flexGrow: this.styles.header.flexGrow} : null}>
                <View onLayout={this.setHeaderPositon.bind(this, i)} accessible={true} accessibilityRole='header'>
                  <View style={[
                    this.styles.header,
                    {flexGrow: undefined},
                    isSelected ? this.styles.activeHeader : null]}>
                    <WmIcon
                      id={this.getTestId('headericon')}
                      styles={this.theme.mergeStyle({}, this.styles.headerIcon, isSelected ? this.styles.activeHeaderIcon : null)}
                      iconclass={header.icon}></WmIcon>
                    <Text numberOfLines={1} style={[
                      this.styles.headerText, 
                      isSelected ? this.styles.activeHeaderText : null]}
                      {...this.getTestPropsForLabel(i + '_title')}
                    >{header.title}</Text>
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
          <Animated.View style={[{
              transform: [{
                scaleX: this.reverseIndicatorWidth
              }]
            },
            this.styles.arrowIndicator
          ]}>
            {arrowIndicator.backgroundImage ? (<BackgroundComponent
            image={arrowIndicator.backgroundImage}
            position={arrowIndicator.backgroundPosition}
            size={arrowIndicator.backgroundSize}
            repeat={arrowIndicator.backgroundRepeat}
            resizeMode={arrowIndicator.backgroundResizeMode}
            style={{borderRadius: this.styles.root.borderRadius}}
          ></BackgroundComponent>) : null }
            <View style={this.styles.arrowIndicatorDot}></View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
      </View>
    ); 
  }
}
