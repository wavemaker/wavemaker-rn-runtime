import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSliderProps from './slider.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSliderStyles } from './slider.styles';
import { debounce, isNumber } from 'lodash';

export class WmSliderState extends BaseComponentState<WmSliderProps> {}

export default class WmSlider extends BaseComponent<WmSliderProps, WmSliderState, WmSliderStyles> {
  valueBeforeSlide = 0;

  constructor(props: WmSliderProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSliderProps());
    if (!isNumber(this.state.props.datavalue)) {
      this.state.props.datavalue = this.state.props.minvalue + (this.state.props.maxvalue - this.state.props.minvalue)/2;
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'datavalue': 
        if (isNumber($new) && isNumber($old)) {
          this.invokeEventCallback('onChange', [null, this, $new, $old]);
        }
      break;
    }
  }

  onChange = debounce((value: number) => {
    this.updateState({
      props : {
        datavalue: value
      }
    } as WmSliderState);
  }, 200);

  onBeforeSlide = () => this.valueBeforeSlide = this.props.datavalue;

  onAfterSlide = () => this.valueBeforeSlide = 0;

  renderWidget(props: WmSliderProps) {
    return (
    <View style={this.styles.root}>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text>{props.minvalue}</Text>
        <Text>{props.datavalue}</Text>
        <Text>{props.maxvalue}</Text>
      </View>
      <Slider
        style={props.readonly || props.disabled ? this.styles.disabled : {}}
        step={props.step}
        value={this.valueBeforeSlide || props.datavalue}
        disabled={props.readonly}
        minimumValue={props.minvalue}
        maximumValue={props.maxvalue}
        onValueChange={this.onChange}
        thumbTintColor={this.styles.thumb.backgroundColor}
        onTouchStart={this.onBeforeSlide}
        onTouchEnd={this.onAfterSlide}
        minimumTrackTintColor={this.styles.minimumTrack.backgroundColor}
        maximumTrackTintColor={this.styles.maximumTrack.backgroundColor}
      />
    </View>); 
  }
}
