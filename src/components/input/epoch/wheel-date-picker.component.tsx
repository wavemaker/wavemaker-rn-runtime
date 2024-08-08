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

  getValue = (minDate: Date, maxDate: Date, type: 'date' | 'month' | 'year') => {
    const currentMonth = moment(maxDate).format('M');
    const currentYear = moment(maxDate).format('YYYY');
    const selectedMonth = moment(this.localSelectedDate).format('M');
    const selectedYear = moment(this.localSelectedDate).format('YYYY');
    const isFutureMonth = Number(selectedMonth) > Number(currentMonth);
    const isFutureYear = Number(selectedYear) > Number(currentYear);
    const isPastMonth = Number(selectedMonth) < Number(currentMonth);
    const isPastYear = Number(selectedYear) < Number(currentYear);
    let selectedMinValue = 0;
    let selectedMaxValue = 0;
    let selectedValueIndex = 0;

    switch(type) {
      case 'date':
        const minDateValue =
          isFutureYear
            ? 1
            : isFutureMonth
              ? 1
              : new Date(minDate).getDate();
        const maxDateValue = isPastYear
          ? 31
          : isPastMonth
            ? 31
            : new Date(maxDate).getDate();
        const selectedDateIndex = isPastYear
          ? this.selectedDateIndex
          : isPastMonth
            ? this.selectedDateIndex
            : new Date(maxDate).getDate() - 1;

        selectedMinValue = minDateValue;
        selectedMaxValue = maxDateValue;
        selectedValueIndex = selectedDateIndex;
        break;
      case 'month':
        const minMonthValue = isFutureYear ? 0 : new Date(minDate).getMonth();
        const maxMonthValue = isPastYear ? 11 : new Date(maxDate).getMonth();
        const selectedMonthIndex = isPastYear
          ? this.selectedMonthIndex
          : new Date(maxDate).getMonth();

        selectedMinValue = minMonthValue;
        selectedMaxValue = maxMonthValue;
        selectedValueIndex = selectedMonthIndex;
        break;
      case 'year':
        selectedMinValue = new Date(minDate).getFullYear();
        selectedMaxValue = new Date(maxDate).getFullYear();
        selectedValueIndex = this.selectedYearIndex;
        break;
    }

    return {
      selectedMinValue,
      selectedMaxValue,
      selectedValueIndex
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
    const minDate = props.minDate ? new Date(props.minDate) : getDateObject(1, 0, 1950);
    const maxDate = props.maxDate ? new Date(props.maxDate) : getDateObject(31, 11, 2060);
    // * date range
    // const minDateNum = minDate ? this.getMinValue(minDate, 'date') : 1;
    // const maxDateNum = maxDate ? this.getMaxValue(minDateNum, maxDate, 'date') : 31;
    let minDateNum = START_DATE['date'];
    let maxDateNum = END_DATE['date'];
    let minYear = START_DATE['year'];
    let maxYear = END_DATE['year'];
    // const minYear = minDate ? this.getMinValue(minDate, 'year') : 1950;
    // const maxYear = maxDate ? this.getMaxValue(minDateNum, maxDate, 'year') : 2060;

    const {selectedMinValue: minDateValue, selectedMaxValue: maxDateValue, selectedValueIndex: dateIndex} = this.getValue(minDate, maxDate, 'date');
    const {selectedValueIndex: monthIndex} = this.getValue(minDate, maxDate, 'month');
    const {selectedMinValue: minYearValue, selectedMaxValue: maxYearValue, selectedValueIndex: yearIndex} = this.getValue(minDate, maxDate, 'year');
    minDateNum = minDateValue;
    maxDateNum = maxDateValue;
    minYear = minYearValue;
    maxYear = maxYearValue;

    // console.log('index ==>', dateIndex, monthIndex, yearIndex)
    // TODO: start here
    // const selectedDate = getDates(minDateNum, maxDateNum)[this.selectedDateIndex];
    // const selectedMonthIndex = this.monthValue;
    // const selectedYear = getYearRange(minYear, maxYear)[this.selectedYearIndex];
    const selectedDate = getDates(minDateNum, maxDateNum)[dateIndex];
    const selectedMonthIndex = monthIndex;
    const selectedYear = getYearRange(minYear, maxYear)[yearIndex];

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
    const minDate = props.minDate ? new Date(props.minDate) : getDateObject(1, 0, 1950);
    const maxDate = props.maxDate ? new Date(props.maxDate) : getDateObject(31, 11, 2060);
    let minDateNum = START_DATE['date'];
    let maxDateNum = END_DATE['date'];
    let minMonth = START_DATE['month'];
    let maxMonth = END_DATE['month'];
    let minYear = START_DATE['year'];
    let maxYear = END_DATE['year'];

    const {selectedMinValue: minDateValue, selectedMaxValue: maxDateValue} = this.getValue(minDate, maxDate, 'date');
    const {selectedMinValue: minMonthValue, selectedMaxValue: maxMonthValue} = this.getValue(minDate, maxDate, 'month');
    const {selectedMinValue: minYearValue, selectedMaxValue: maxYearValue} = this.getValue(minDate, maxDate, 'year');
    minDateNum = minDateValue;
    maxDateNum = maxDateValue;
    minMonth = minMonthValue;
    maxMonth = maxMonthValue;
    minYear = minYearValue;
    maxYear = maxYearValue;
    // const minDateNum = minDate ? this.getMinValue(minDate, 'date') : 1;
    // const maxDateNum = maxDate ? this.getMaxValue(minDateNum, maxDate, 'date') : 31;
    // const minMonth = minDate ? this.getMinValue(minDate, 'month') : 0;
    // const maxMonth = maxDate ? this.getMaxValue(minDateNum, maxDate, 'month') : 11;
    // const minYear = minDate ? this.getMinValue(minDate, 'year') : 1950;
    // const maxYear = maxDate ? this.getMaxValue(minDateNum, maxDate, 'year') : 2060;

    // console.log('values date==>', minDateNum, maxDateNum)
    // console.log('values month==>', minMonth, maxMonth)
    // console.log('values year==>', minYear, maxYear)
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
