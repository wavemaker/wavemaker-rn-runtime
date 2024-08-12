import React, { Component } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
import WmWheelScrollPicker from './wheelpicker/wheelpicker.component'
import { getDateObject, getDates, getMonths, getYearRange } from '@wavemaker/app-rn-runtime/core/utils';

export class WmWheelDatePickerProps {
  selectedDate?: Date = new Date();
  onDateChange?: (date: Date) => void;
  itemHeight?: number = PixelRatio.roundToNearestPixel(50);
  wrapperHeight?: number = PixelRatio.roundToNearestPixel(150);
}

export class WmWheelDatePickerState {}

export class WmWheelDatePicker extends Component<
  WmWheelDatePickerProps,
  WmWheelDatePickerState,
  any
> {
  itemHeight: number;
  wrapperHeight: number;
  selectedDateIndex: number = 0;
  selectedMonthIndex: number = 0;
  selectedYearIndex: number = 0;

  constructor(props: WmWheelDatePickerProps) {
    super(props);
    const selectedDate = this.props.selectedDate || new Date();

    this.itemHeight =
    PixelRatio.roundToNearestPixel(this.props.itemHeight || 50) || PixelRatio.roundToNearestPixel(50);
    this.wrapperHeight =
    PixelRatio.roundToNearestPixel(this.props.wrapperHeight || 150) || PixelRatio.roundToNearestPixel(150);
    this.selectedDateIndex = selectedDate.getDate() - 1;
    this.selectedMonthIndex = selectedDate.getMonth();
    this.selectedYearIndex = getYearRange().indexOf(selectedDate.getFullYear());
  }

  handleValueChange = (
    valueType: 'date' | 'month' | 'year',
    value: string | number,
    index: number,
  ) => {
    switch (valueType) {
      case 'date':
        this.selectedDateIndex = index;
        break;
      case 'month':
        this.selectedMonthIndex = index;
        break;
      case 'year':
        this.selectedYearIndex = index;
        break;
      default:
        break;
    }

    const selectedDate = getDates()[this.selectedDateIndex];
    const selectedYear = getYearRange()[this.selectedYearIndex];
    const dateObj = getDateObject(
      selectedDate,
      this.selectedMonthIndex,
      selectedYear,
    );

    this.props?.onDateChange?.(dateObj);
  };

  render() {
    return (
      <View style={styles.root}>
        <WmWheelScrollPicker
          data={getDates()}
          wrapperHeight={this.wrapperHeight}
          itemHeight={this.itemHeight}
          selectedIndex={this.selectedDateIndex}
          onValueChange={(value: string | number, index: number) =>
            this.handleValueChange('date', value, index)
          }
        />
        <View style={styles.middle}>
          <WmWheelScrollPicker
            data={getMonths()}
            wrapperHeight={this.wrapperHeight}
            itemHeight={this.itemHeight}
            selectedIndex={this.selectedMonthIndex}
            onValueChange={(value: string | number, index: number) =>
              this.handleValueChange('month', value, index)
            }
          />
        </View>
        <WmWheelScrollPicker
          data={getYearRange()}
          wrapperHeight={this.wrapperHeight}
          itemHeight={this.itemHeight}
          selectedIndex={this.selectedYearIndex}
          onValueChange={(value: string | number, index: number) =>
            this.handleValueChange('year', value, index)
          }
        />
      </View>
    );
  }
}

export default WmWheelDatePicker;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  middle: {
    marginHorizontal: 15,
  },
});
