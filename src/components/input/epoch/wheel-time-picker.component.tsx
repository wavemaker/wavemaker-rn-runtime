import React, { Component } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
import WmWheelScrollPicker from './wheelpicker/wheelpicker.component';
import {
  get24Hours,
  getDateTimeObject,
  getHours,
  getMinutes,
  getTimeIndicators,
} from '@wavemaker/app-rn-runtime/core/utils';

export class WmWheelTimePickerProps {
  selectedTime?: Date = new Date();
  is24Hour?: boolean = true;
  onTimeChange?: (date: Date) => void;
  itemHeight?: number = PixelRatio.roundToNearestPixel(50);
  wrapperHeight?: number = PixelRatio.roundToNearestPixel(150);
}

export class WmWheelTimePickerState {}

export class WmWheelTimePicker extends Component<
  WmWheelTimePickerProps,
  WmWheelTimePickerState,
  any
> {
  itemHeight: number;
  wrapperHeight: number;
  selectedHourIndex: number = 0;
  selectedMinuteIndex: number = 0;
  selectedTimeIndicatorIndex: number = 0;

  constructor(props: WmWheelTimePickerProps) {
    super(props);
    const selectedTime = props.selectedTime || new Date();
    const meridiem = selectedTime.getHours() >= 12 ? 'PM' : 'AM';

    this.itemHeight =
      PixelRatio.roundToNearestPixel(this.props.itemHeight || 50) ||
      PixelRatio.roundToNearestPixel(50);
    this.wrapperHeight =
      PixelRatio.roundToNearestPixel(this.props.wrapperHeight || 150) ||
      PixelRatio.roundToNearestPixel(150);
    this.selectedHourIndex = props.is24Hour
      ? selectedTime.getHours()
      : (selectedTime.getHours() % 12 || 12) - 1;
    this.selectedMinuteIndex = selectedTime.getMinutes();
    this.selectedTimeIndicatorIndex = meridiem === 'AM' ? 0 : 1;
  }

  handleValueChange = (
    valueType: 'hour' | 'minute' | 'meridiem',
    value: string | number,
    index: number
  ) => {
    switch (valueType) {
      case 'hour':
        this.selectedHourIndex = index;
        break;
      case 'minute':
        this.selectedMinuteIndex = index;
        break;
      case 'meridiem':
        this.selectedTimeIndicatorIndex = index;
        break;
      default:
        break;
    }

    const selectedTime = this.props.selectedTime || new Date();
    const date = selectedTime.getDate();
    const month = selectedTime.getMonth();
    const year = selectedTime.getFullYear();

    let selected24HourFormat;
    if (!this.props.is24Hour) {
      // * when time picker is in 12 hour format
      const selected12HourFormat = Number(getHours()[this.selectedHourIndex]);
      selected24HourFormat =
        this.selectedTimeIndicatorIndex === 0
          ? selected12HourFormat
          : selected12HourFormat + 12;
    } else {
      // * when time picker is in 24 hour format
      selected24HourFormat = Number(get24Hours()[this.selectedHourIndex]);
    }

    const selectedMinute = Number(getMinutes()[this.selectedMinuteIndex]);

    const dateObj = getDateTimeObject(
      date,
      month,
      year,
      selected24HourFormat,
      selectedMinute
    );

    this.props?.onTimeChange?.(dateObj);
  };

  render() {
    return (
      <View style={styles.root}>
        <WmWheelScrollPicker
          data={this.props.is24Hour ? get24Hours() : getHours()}
          wrapperHeight={this.wrapperHeight}
          itemHeight={this.itemHeight}
          selectedIndex={this.selectedHourIndex}
          onValueChange={(value: string | number, index: number) => {
            this.handleValueChange('hour', value, index);
          }}
        />
        <View style={styles.middle}>
          <WmWheelScrollPicker
            data={getMinutes()}
            wrapperHeight={this.wrapperHeight}
            itemHeight={this.itemHeight}
            selectedIndex={this.selectedMinuteIndex}
            onValueChange={(value: string | number, index: number) => {
              this.handleValueChange('minute', value, index);
            }}
          />
        </View>
        {!this.props.is24Hour ? (
          <WmWheelScrollPicker
            data={getTimeIndicators()}
            wrapperHeight={this.wrapperHeight}
            itemHeight={this.itemHeight}
            selectedIndex={this.selectedTimeIndicatorIndex}
            onValueChange={(value: string | number, index: number) => {
              this.handleValueChange('meridiem', value, index);
            }}
          />
        ) : (
          <></>
        )}
      </View>
    );
  }
}

export default WmWheelTimePicker;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  middle: {
    marginHorizontal: 15,
  },
});
