import React, { Component } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
import WmWheelScrollPicker from './wheelpicker/wheelpicker.component'
import { getDateObject, getDates, getMonthIndex, getMonths, getYearRange } from '@wavemaker/app-rn-runtime/core/utils';
import moment from 'moment';

export class WmWheelDatePickerProps {
  minDate?: Date | string;
  maxDate?: Date | string;
  selectedDate?: Date = new Date();
  onDateChange?: (date: Date) => void;
  itemHeight?: number = PixelRatio.roundToNearestPixel(50);
  wrapperHeight?: number = PixelRatio.roundToNearestPixel(150);
}

export const START_DATE = {
  'date': 1,
  'month': 0,
  'year': 1950,
};

export const END_DATE = {
  'date': 31,
  'month': 11,
  'year': 2060,
};

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
  dateData: number[] = [];
  monthData: string[] = [];
  yearData: number[] = [];
  defaultSelectedDate: Date;
  localSelectedDate: Date | string = '';
  monthValue: number = 0;
  yearValue: string = '';

  constructor(props: WmWheelDatePickerProps) {
    super(props);
    const selectedDate = this.props.selectedDate || new Date();

    this.itemHeight =
    PixelRatio.roundToNearestPixel(this.props.itemHeight || 50) || PixelRatio.roundToNearestPixel(50);
    this.wrapperHeight =
    PixelRatio.roundToNearestPixel(this.props.wrapperHeight || 150) || PixelRatio.roundToNearestPixel(150);

    // * Initial values
    this.defaultSelectedDate = selectedDate;
    this.localSelectedDate = selectedDate;
    this.monthValue = selectedDate.getMonth();
    this.yearValue = selectedDate.getFullYear()?.toString();

    // TODO: selected date handling for range of dates
    if (!(this.props.minDate || this.props.maxDate)) {
      this.selectedDateIndex = selectedDate.getDate() - 1;
      this.selectedMonthIndex = selectedDate.getMonth();
      this.selectedYearIndex = getYearRange().indexOf(selectedDate.getFullYear());
    }
  }

  getMinValue = (minValue: string | Date, type: 'date' | 'month' | 'year') => {
    const currentMonth = moment(minValue).format('M');
    const currentYear = moment(minValue).format('YYYY');
    const selectedMonth = moment(this.localSelectedDate).format('M');
    const selectedYear = moment(this.localSelectedDate).format('YYYY');
    const isFutureMonth = Number(selectedMonth) > Number(currentMonth);
    const isFutureYear = Number(selectedYear) > Number(currentYear);

    if (!(minValue instanceof Date)) return START_DATE[type];

    switch(type) {
      case 'date':
        const dateValue =
          isFutureYear
            ? 1
            : isFutureMonth
              ? 1
              : new Date(minValue).getDate();
        // this.selectedDateIndex = dateIndex;
        return dateValue;
      case 'month':
        const monthValue = isFutureYear ? 0 : new Date(minValue).getMonth();
        // this.selectedMonthIndex = 11;
        return monthValue;
      case 'year':
        return new Date(minValue).getFullYear();
      default:
        return 0;
    }
  }

  getMaxValue = (maxValue: string | Date | undefined, type: 'date' | 'month' | 'year') => {
    if (!(maxValue instanceof Date)) return END_DATE[type];

    switch(type) {
      case 'date':
        return new Date(maxValue).getDate();
      case 'month':
        return new Date(maxValue).getMonth();
      case 'year':
        return new Date(maxValue).getFullYear();
      default:
        return 0;
    }
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
        this.monthValue = getMonthIndex(value?.toString());
        this.selectedMonthIndex = index;
        break;
      case 'year':
        this.yearValue = value as string;
        this.selectedYearIndex = index;
        break;
      default:
        break;
    }

    const {props} = this;
    const minDate = props.minDate;
    const maxDate = props.maxDate;
    // * date range
    const minDateNum = minDate ? this.getMinValue(minDate, 'date') : 1;
    const maxDateNum = maxDate ? this.getMaxValue(maxDate, 'date') : 31;
    const minYear = minDate ? this.getMinValue(minDate, 'year') : 1950;
    const maxYear = maxDate ? this.getMaxValue(maxDate, 'year') : 2060;

    const selectedDate = getDates(minDateNum, maxDateNum)[this.selectedDateIndex];
    const selectedMonthIndex = this.monthValue;
    const selectedYear = getYearRange(minYear, maxYear)[this.selectedYearIndex];

    const dateObj = getDateObject(
      selectedDate,
      selectedMonthIndex,
      selectedYear,
    );
    this.localSelectedDate = dateObj;

    this.props?.onDateChange?.(dateObj);
  };

  // TODO: cache this func for performance improvement
  getPickerData(type: 'date' | 'month' | 'year') {
    const {props} = this;
    const minDate = props.minDate;
    const maxDate = props.maxDate;
    const minDateNum = minDate ? this.getMinValue(minDate, 'date') : 1;
    const maxDateNum = maxDate ? this.getMaxValue(maxDate, 'date') : 31;
    const minMonth = minDate ? this.getMinValue(minDate, 'month') : 0;
    const maxMonth = maxDate ? this.getMaxValue(maxDate, 'month') : 11;
    const minYear = minDate ? this.getMinValue(minDate, 'year') : 1950;
    const maxYear = maxDate ? this.getMaxValue(maxDate, 'year') : 2060;

    switch (type) {
      case "date":
        const dateData = getDates(minDateNum, maxDateNum);
        this.dateData = dateData;
        return dateData;
      case "month":
        const monthData = getMonths(minMonth, maxMonth);
        this.monthData = monthData;
        return monthData;
      case "year":
        const yearData = getYearRange(minYear, maxYear);
        this.yearData = yearData;
        return yearData;
      default:
        return [];
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <WmWheelScrollPicker
          data={this.getPickerData('date')}
          wrapperHeight={this.wrapperHeight}
          itemHeight={this.itemHeight}
          selectedIndex={this.selectedDateIndex}
          onValueChange={(value: string | number, index: number) =>
            this.handleValueChange('date', value, index)
          }
        />
        <View style={styles.middle}>
          <WmWheelScrollPicker
            data={this.getPickerData('month')}
            wrapperHeight={this.wrapperHeight}
            itemHeight={this.itemHeight}
            selectedIndex={this.selectedMonthIndex}
            onValueChange={(value: string | number, index: number) =>
              this.handleValueChange('month', value, index)
            }
          />
        </View>
        <WmWheelScrollPicker
          data={this.getPickerData('year')}
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
