import React, { Component } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
import WmWheelScrollPicker from './wheelpicker/wheelpicker.component'
import { getDateObject, getDates, getMonths, getYearRange, getDaysInMonth, getMonthIndex } from '@wavemaker/app-rn-runtime/core/utils';
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


export class WmWheelDatePickerState { }

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
  defaultSelectedDate: Date;
  localSelectedDate: Date | string = '';
  monthValue: number = 0;
  yearValue: string = '';
  monthData: string[] = [];
  yearData: number[] = [];
  dateData: number[] = [];




  constructor(props: WmWheelDatePickerProps) {
    super(props);
    // const selectedDate = this.props.selectedDate || new Date();
    const minDate = this.props.minDate ? new Date(this.props.minDate) : new Date(START_DATE.year, START_DATE.month, START_DATE.date);
    const maxDate = this.props.maxDate ? new Date(this.props.maxDate) : new Date(END_DATE.year, END_DATE.month, END_DATE.date);
    let selectedDate = this.props.selectedDate ? new Date(this.props.selectedDate) : new Date();

    if (selectedDate < minDate) selectedDate = minDate;
    if (selectedDate > maxDate) selectedDate = maxDate;

    this.itemHeight =
      PixelRatio.roundToNearestPixel(this.props.itemHeight || 50) || PixelRatio.roundToNearestPixel(50);
    this.wrapperHeight =
      PixelRatio.roundToNearestPixel(this.props.wrapperHeight || 150) || PixelRatio.roundToNearestPixel(150);

    // * Initial values
    this.defaultSelectedDate = selectedDate;
    this.localSelectedDate = selectedDate;
    this.monthValue = selectedDate.getMonth();
    this.yearValue = selectedDate.getFullYear()?.toString();

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    // Generate valid year range
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    this.yearData = getYearRange(minYear, maxYear);
    this.selectedYearIndex = this.yearData.indexOf(selectedYear);

    // Generate valid months based on selected year
    let minMonth = 0;
    let maxMonth = 11;
    if (selectedYear === minYear) minMonth = minDate.getMonth();
    if (selectedYear === maxYear) maxMonth = maxDate.getMonth();
    this.monthData = getMonths(minMonth, maxMonth);
    this.selectedMonthIndex = this.monthData.indexOf(getMonths(0, 11)[selectedMonth]);

    // Generate valid days based on selected year & month
    let minDay = 1;
    let maxDay = getDaysInMonth(selectedMonth + 1, selectedYear);
    if (selectedYear === minYear && selectedMonth === minMonth) minDay = minDate.getDate();
    if (selectedYear === maxYear && selectedMonth === maxMonth) maxDay = maxDate.getDate();
    this.dateData = getDates(minDay, maxDay);
    this.selectedDateIndex = this.dateData.indexOf(selectedDay);
  }

  getMinValue = (type: 'date' | 'month' | 'year') => {
    if (!this.props.minDate) return START_DATE[type];

    const minDate = new Date(this.props.minDate);
    switch (type) {
      case 'date':
        return minDate.getDate();
      case 'month':
        return minDate.getMonth();
      case 'year':
        return minDate.getFullYear();
      default:
        return 0;
    }
  };

  getMaxValue = (type: 'date' | 'month' | 'year') => {
    if (!this.props.maxDate) return END_DATE[type];

    const maxDate = new Date(this.props.maxDate);
    switch (type) {
      case 'date':
        return maxDate.getDate();
      case 'month':
        return maxDate.getMonth();
      case 'year':
        return maxDate.getFullYear();
      default:
        return 0;
    }
  };


  handleValueChange = (valueType: 'date' | 'month' | 'year', value: string | number, index: number) => {
    let indexValue = Object.is(index, -0) ? 0 : index;
    switch (valueType) {
      case 'date':
        this.selectedDateIndex = indexValue;
        break;
      case 'month':
        this.monthValue = getMonthIndex(value?.toString());
        this.selectedMonthIndex = indexValue;
        break;
      case 'year':
        this.selectedYearIndex = indexValue;
        break;
    }

    const minYear = this.getMinValue('year');
    const maxYear = this.getMaxValue('year');
    const selectedYear = getYearRange(minYear, maxYear)[this.selectedYearIndex];

    // Restrict months dynamically
    let minMonth = 0;
    let maxMonth = 11;
    if (selectedYear === minYear) minMonth = this.getMinValue('month');
    if (selectedYear === maxYear) maxMonth = this.getMaxValue('month');

    // Update month data dynamically
    this.monthData = getMonths(minMonth, maxMonth);

    // Ensure selected month is within range
    let minDate = 1;
    let maxDate: number = 31;

    if (this.monthValue > maxMonth) {
      this.selectedMonthIndex = maxMonth;
    }

    maxDate = getDaysInMonth(
      getMonthIndex(this.monthData[this.selectedMonthIndex]) + 1,
      selectedYear
    );

    if (this.monthValue < minMonth) {
      this.monthValue = minMonth;
      maxDate = getDaysInMonth(this.monthValue + 1, selectedYear);

    }

    // Restrict days dynamically
    const selectedMonth = this.selectedMonthIndex;
    if (selectedYear === minYear && this.monthValue === minMonth) minDate = this.getMinValue('date');

    if (selectedYear === maxYear && selectedMonth === maxMonth) maxDate = this.getMaxValue('date');


    // Update date data dynamically
    this.dateData = getDates(minDate, maxDate);

    // Ensure selected date is within range
    if (this.selectedDateIndex > maxDate - 1) this.selectedDateIndex = maxDate - 1;

    const selectedDate = this.dateData[this.selectedDateIndex] || this.dateData[this.dateData.indexOf(this.selectedDateIndex + 1)];;


    // Create new selected date
    const dateObj = getDateObject(selectedDate, getMonthIndex(this.monthData[this.selectedMonthIndex]), selectedYear);
    this.localSelectedDate = dateObj;

    this.props?.onDateChange?.(this.localSelectedDate);
  };

  render() {
    return (
      <View style={styles.root}>
        <WmWheelScrollPicker
          data={this.dateData}
          wrapperHeight={this.wrapperHeight}
          itemHeight={this.itemHeight}
          selectedIndex={this.selectedDateIndex}
          onValueChange={(value, index) =>
            this.handleValueChange('date', value, index)
          }
        />
        <View style={styles.middle}>
          <WmWheelScrollPicker
            data={this.monthData}
            wrapperHeight={this.wrapperHeight}
            itemHeight={this.itemHeight}
            selectedIndex={this.selectedMonthIndex}
            onValueChange={(value, index) =>
              this.handleValueChange('month', value, index)
            }
          />
        </View>
        <WmWheelScrollPicker
          data={getYearRange(this.getMinValue('year'), this.getMaxValue('year'))}
          wrapperHeight={this.wrapperHeight}
          itemHeight={this.itemHeight}
          selectedIndex={this.selectedYearIndex}
          onValueChange={(value, index) =>
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
