import React from 'react';
import { View, Text, LayoutChangeEvent, TouchableOpacity, Animated, Easing } from 'react-native';
import { debounce, isNumber, isNil } from 'lodash';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSliderProps from './slider.props';
import { DEFAULT_CLASS, WmSliderStyles } from './slider.styles';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class WmSliderState extends BaseComponentState<WmSliderProps> {
  track?: {
    top: number,
    left: number,
    width: number,
    height: number
  };
}

export default class WmSlider extends BaseComponent<WmSliderProps, WmSliderState, WmSliderStyles> {
  valueBeforeSlide: number = 0;
  private position = new Animated.Value(0);
  private trackGesture = Gesture.Pan();
  private knobGesture = Gesture.Pan();

  constructor(props: WmSliderProps) {
    super(props, DEFAULT_CLASS, new WmSliderProps());
    this.configureGesture(this.trackGesture);
    this.configureGesture(this.knobGesture);
  }

  getValueFromGesture(positionX: number) {
    if (this.state.track) {
      const factor = (positionX - this.state.track.left) / this.state.track.width;
      const props = this.state.props;
      const step = props.step || (props.maxvalue - props.minvalue) / 100;
      let value =  Math.round((factor * props.maxvalue + props.minvalue) / step) * step;
      return Math.max(Math.min(props.maxvalue, value), props.minvalue);
    }
    return 0;
  };

  configureGesture(gesture: PanGesture) {
    gesture
      .maxPointers(1)
      .minDistance(0)
      .onChange(e => {
        const value = this.getValueFromGesture(e.absoluteX);
        this.computePosition(value);
        this.forceUpdate();
      })
      .onEnd(e => {
        if (this.state.track) {
          const value = this.getValueFromGesture(e.absoluteX);
          this.onChange(value);
          this.forceUpdate();
        }
      })
  }

  getDataValue() {
    if (isNil(this.props.datavalue)) {
      return this.state.props.minvalue + (this.state.props.maxvalue - this.state.props.minvalue)/2;
    }
    return Math.min(Math.max(this.props.datavalue, this.state.props.minvalue), this.state.props.maxvalue);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'datavalue':
        if (isNumber($new) && isNumber($old)) {
          this.invokeEventCallback('onChange', [null, this, $new, $old]);
        }
      case 'maxvalue':
      case 'minvalue': 
        this.setProp('datavalue', this.getDataValue() || 0)
        this.computePosition(this.state.props.datavalue);
    }
  }

  onChange = debounce((value: number) => {
    if (this.state.props.datavalue !== value) {
      this.updateState({
        props : {
          datavalue: value
        }
      } as WmSliderState);
      this.props.onFieldChange &&
      this.props.onFieldChange(
        'datavalue',
        value,
        this.state.props.datavalue
      );
    }
  }, 200);

  computePosition(datavalue: number) {
    const props = this.state.props;
    const width = this.state.track?.width || 0;
    const value = ((datavalue - props.minvalue) / props.maxvalue) * (width);
    this.position?.setValue(isNaN(value) ? 0 : value);
  }

  onLayoutChange = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    this.updateState({
      track: {
        top: isWebPreviewMode() ? (layout as any).top : layout.y,
        left: isWebPreviewMode() ? (layout as any).left : layout.x,
        width: layout.width,
        height: layout.height
      }
    } as WmSliderState, () => this.computePosition(this.state.props.datavalue));
  }

  renderWidget(props: WmSliderProps) {
    const width = this.state.track?.width || 0;
    return (
    <View style={this.styles.root}>
      {this._background}
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text {...this.getTestProps('min')} style={[this.styles.text, this.styles.minimumValue]}>{props.minvalue}</Text>
        <Text {...this.getTestProps('value')} style={[this.styles.text, this.styles.value]}>{props.datavalue}</Text>
        <Text {...this.getTestProps('max')} style={[this.styles.text, this.styles.maximumValue]}>{props.maxvalue}</Text>
      </View>
      <GestureDetector gesture={this.trackGesture}>
        <TouchableOpacity
          activeOpacity={1} 
          style={this.styles.track}
          onLayout={this.onLayoutChange}
          {...this.getTestProps()}>
            <Animated.View style={[this.styles.minimumTrack, {
              width: width,
              transform: [{
                translateX: this.position.interpolate({
                  inputRange: [0, width],
                  outputRange: [-width, 0]
                })
              }]
            }]}></Animated.View>
            <Animated.View style={[this.styles.maximumTrack, {
              width: width,
              transform: [{
                translateX: this.position
              }]
            }]}></Animated.View>
        </TouchableOpacity>
      </GestureDetector>
      <GestureDetector gesture={this.knobGesture}>
        <Animated.View style={[this.styles.thumb, {
          transform: [{
            translateX: this.position
          }]
        }]}>
          <BackgroundComponent
            size={(this.styles.thumb as any).backgroundSize || 'contain'}
            position={(this.styles.thumb as any).backgroundPosition}
            image={(this.styles.thumb as any).backgroundImage}
            repeat={(this.styles.thumb as any).backgroundRepeat || 'no-repeat'}>  
          </BackgroundComponent>
        </Animated.View>
      </GestureDetector>
    </View>);
  }
}
