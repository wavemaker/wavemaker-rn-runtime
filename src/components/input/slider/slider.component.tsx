import React from 'react';
import {View, Text } from 'react-native';
import { debounce, isNumber, isNil } from 'lodash';
import Slider from '@react-native-community/slider';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSliderProps from './slider.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSliderStyles } from './slider.styles';

export class WmSliderState extends BaseComponentState<WmSliderProps> {}

export default class WmSlider extends BaseComponent<WmSliderProps, WmSliderState, WmSliderStyles> {
  valueBeforeSlide: number = 0;

  constructor(props: WmSliderProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSliderProps());
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

  onBeforeSlide = () => this.valueBeforeSlide = this.props.datavalue;

  onAfterSlide = () => this.valueBeforeSlide = 0;

  renderWidget(props: WmSliderProps) {
    return (
    <View style={this.styles.root}>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={[this.styles.text, this.styles.minimumValue]}>{props.minvalue}</Text>
        <Text style={[this.styles.text, this.styles.value]}>{props.datavalue}</Text>
        <Text style={[this.styles.text, this.styles.maximumValue]}>{props.maxvalue}</Text>
      </View>
      <Slider
        style={props.readonly || props.disabled ? this.styles.disabled : {}}
        step={props.step}
        value={this.valueBeforeSlide || props.datavalue || 0}
        disabled={props.readonly}
        minimumValue={props.minvalue}
        maximumValue={props.maxvalue}
        onValueChange={this.onChange}
        thumbTintColor={this.styles.thumb.backgroundColor as string}
        onTouchStart={this.onBeforeSlide}
        onTouchEnd={this.onAfterSlide}
        minimumTrackTintColor={this.styles.minimumTrack.backgroundColor as string}
        maximumTrackTintColor={this.styles.maximumTrack.backgroundColor as string}
      />
    </View>);
  }
}
