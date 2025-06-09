/****
 * Copied code from a repo with no active maintenance.
 * https://github.com/hungdev/react-native-customize-selected-date
 * That js lib was converted to ts and fixed bugs. 
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native';
import moment, { Moment } from 'moment';
import styles from './month-view.styles'
import _ from 'lodash';

export class MonthViewProps {
  testID?: string = null as any;
  accessibilityLabel?: string = null as any;
  date?: Moment = null as any;
  minDate? = moment('1990-01-01', 'YYYY-MM-DD');
  maxDate? = moment('2100-01-01', 'YYYY-MM-DD');
  customMonth?: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  customWeekdays?: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  renderPrevYearButton?: () => React.ReactNode = null as any;
  format?='YYYY-MM-DD';
  renderPrevMonthButton?: () => React.ReactNode = null as any;
  renderNextYearButton?: () => React.ReactNode = null as any;
  renderNextMonthButton?: () => React.ReactNode = null as any;
  renderChildDay? = (day: Moment) => (<></>);
  selectDate? = (day: Moment) => {}; 
  //style
  getDayStyle? = (date: Moment) => ({});
  containerStyle?: ViewStyle = null as any;
  warpRowControlMonthYear?: ViewStyle = null as any;
  warpRowWeekdays?: ViewStyle = null as any;
  weekdayStyle?: TextStyle = null as any;
  textDayStyle?: TextStyle = null as any;
  currentDayStyle?: ViewStyle = null as any;
  currentDayTextStyle?: TextStyle = null as any;
  notDayOfCurrentMonthStyle?: ViewStyle = null as any;
  warpDayStyle?: ViewStyle = null as any;
  dateSelectedWarpDayStyle?: ViewStyle = null as any;
  selectedDayTextStyle?: TextStyle = null as any;
  monthTextStyle?: TextStyle = null as any;
  yearTextStyle?: TextStyle = null as any;
}

export class MonthViewState {
  viewMode = 'day';
  currentYear: string = null as any;
  constructor(public selectedDate: Moment = moment()) {

  }
}

export class MonthView extends Component<MonthViewProps, MonthViewState> {

  static defaultProps = new MonthViewProps();

  constructor(props: MonthViewProps) {
    super(props);
    this.state = new MonthViewState(this.props.date);
    // Set moment's locale to ensure week starts on Sunday
    moment.updateLocale('en', {
      week: {
        dow: 0, // Sunday is the first day of the week
        doy: 1, // First week of year must contain 1 January
      }
    });
  }

  calendarArray (date: Moment): Moment[] {
    const dates: Moment[] = [];
    // Ensure we're working with a clone and explicitly set to start of day
    const currDate = date.clone().startOf('month').startOf('day');
    // Get the day of week (0-6, 0 being Sunday)
    const startDay = currDate.day();
    // Move back to the first day of the week
    currDate.subtract(startDay, 'days');
    
    for (let i = 0; i < 42; i += 1) {
      dates[i] = currDate.clone();
      currDate.add(1, 'day');
    }
    return dates;
  }

  renderDay(day: Moment) {
    const { warpDayStyle, dateSelectedWarpDayStyle,
      renderChildDay, textDayStyle, currentDayStyle, currentDayTextStyle, notDayOfCurrentMonthStyle, selectedDayTextStyle } = this.props;
    const dateSelected = this.props.date?.isSame(day);
    const isCurrent = moment().isSame(day, 'date');
    const notCurrentMonth = !this.props.date?.isSame(day, 'month');
    const dateStyle = ((this.props.getDayStyle ? this.props.getDayStyle(day) : null) || {}) as any;
    return (
      <TouchableOpacity 
        testID={this.props.testID + '_' + day.format('yyyy_mm_dd')}
        accessibilityLabel={this.props.testID + '_' + day.format('yyyy_mm_dd')}
        onPress={() => this.selectDate(day)}
        style={[styles.warpDay, warpDayStyle,
          isCurrent ? currentDayStyle : {},
          dateSelected ? { backgroundColor: '#2C1F23', ...dateSelectedWarpDayStyle } : {},
          dateStyle.containerStyle]}
      >
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.day, textDayStyle,
            isCurrent ? currentDayTextStyle : {},
            notCurrentMonth ? { color: '#493D40', ...notDayOfCurrentMonthStyle } : {},
            dateSelected ? { color: '#000', ...selectedDayTextStyle } : {},
            dateStyle.textStyle]}>
            {day.get('date')}
          </Text>
          {renderChildDay && renderChildDay(day)}
        </View>
      </TouchableOpacity>
    )
  }

  selectDate(date: Moment) {
    if (this.isDateEnable(date)) {
      this.props.selectDate && this.props.selectDate(date)
    }
  }

  yearMonthChange(unit: number, type: string) {
    this.selectDate((this.props.date || moment()).clone().add(unit, type as any).startOf('month'));
  }

  isDateEnable(date: Moment) {
    const { minDate, maxDate } = this.props;
    return minDate?.isSameOrBefore(date) && maxDate?.isSameOrAfter(date);
  }

  render() {
    const {
      renderPrevYearButton, renderPrevMonthButton,
      renderNextYearButton, renderNextMonthButton,
      weekdayStyle, customWeekdays, warpRowWeekdays,
      warpRowControlMonthYear, monthTextStyle, yearTextStyle
    } = this.props
    const weekdays = customWeekdays || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const data = this.calendarArray(this.props.date || moment())
    const dayOfWeek: React.ReactNode[] = [];
    const month = this.props.customMonth ? this.props.customMonth[this.props.date?.get('month') || 0]: 'Jan';
    const year = this.props.date?.get('year') || 1;
    _.forEach(weekdays, element => {
      dayOfWeek.push(<Text key={element} style={[styles.weekdays, weekdayStyle]}>{element}</Text>)
    })

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, warpRowControlMonthYear]}>
          {/*<TouchableOpacity onPress={() => this.yearMonthChange(-1, 'year')}>
            {renderPrevYearButton ? renderPrevYearButton() : <Text>{'<<'}</Text>}
          </TouchableOpacity>*/}
          <TouchableOpacity onPress={() => this.yearMonthChange(-1, 'month')}>
            {renderPrevMonthButton ? renderPrevMonthButton() : <Text>{'<'}</Text>}
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.txtHeaderDate, monthTextStyle]} >{month + '  '}</Text>
            <Text style={[styles.txtHeaderDate, yearTextStyle]} >{year}</Text>
          </View>
          <TouchableOpacity onPress={() => this.yearMonthChange(1, 'month')}>
            {renderNextMonthButton ? renderNextMonthButton() : <Text>{'>'}</Text>}
          </TouchableOpacity>
          {/*<TouchableOpacity onPress={() => this.yearMonthChange(1, 'year')}>
            {renderNextYearButton ? renderNextYearButton() : <Text>{'>>'}</Text>}
          </TouchableOpacity>*/}
        </View>
        <View style={[{ flexDirection: 'row', justifyContent: 'space-around' }, warpRowWeekdays]}>
          {dayOfWeek}
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => '' + item.toDate().getTime()}
          renderItem={({ item }) => this.renderDay(item)}
          extraData={this.state}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          numColumns={7}
          style={{
            padding: 4
          }}
        />
      </View>
    )
  }
}