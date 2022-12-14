import React from 'react';
import { View } from 'react-native';
import { isString } from 'lodash';
import moment, { Moment } from 'moment';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import { MonthView } from './views/month-view';
import WmCalendarProps from './calendar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCalendarStyles } from './calendar.styles';
import WmIcon from '../../basic/icon/icon.component';

export class WmCalendarState extends BaseComponentState<WmCalendarProps> {
  selectedDate: Moment = moment();
  calendar: Map<String, { date: number, events: any []}> = new Map();
}

const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

export default class WmCalendar extends BaseComponent<WmCalendarProps, WmCalendarState, WmCalendarStyles> {

  constructor(props: WmCalendarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCalendarProps(), new WmCalendarState());
  }

  onDateChange = (date: Moment) => {
    const d = moment(date).format(DEFAULT_DATE_FORMAT);
    const dateWindow = this.state.calendar.get(d);
    this.updateState({
      props: {datavalue: d},
      selectedDate: date
    } as WmCalendarState);
    this.invokeEventCallback('onSelect', [d, d, this, dateWindow?.events]);
  }

  prepareDataset(dataset: any[]) {
    if (!dataset) {
      return;
    }
    const state = {
      calendar: new Map()
    } as WmCalendarState;
    const eventStartKey = this.state.props.eventstart;
    dataset.forEach(d => {
      let startDate = d[eventStartKey];
      if (!isString(startDate)) {
        startDate = moment(startDate).format(DEFAULT_DATE_FORMAT);
      }
      if (!state.calendar.has(startDate)) {
        state.calendar.set(startDate, {
          date: moment(startDate, DEFAULT_DATE_FORMAT).get('milliseconds'),
          events: []
        });
      }
      const dateWindow = state.calendar.get(startDate);
      dateWindow?.events.push(d);
    });
    this.updateState(state);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'dataset':
        this.prepareDataset($new);
        break;
      case 'datavalue':
        if ($new) {
          this.updateState({
            selectedDate: isString($new) ? moment($new, DEFAULT_DATE_FORMAT) : moment($new)
          } as WmCalendarState)
      }
    }
  }

  renderDay = (date: Moment) => {
    const dateWindow = this.state.calendar.get(moment(date).format(DEFAULT_DATE_FORMAT));
    if (dateWindow) {
      return (
        <WmIcon
          iconclass="fa fa-circle"
          iconsize={8}
          styles={{
            root: {marginTop: -8, alignSelf: 'flexStart'},
            icon: this.styles['eventDay' + Math.min(3, dateWindow.events.length)]}}></WmIcon>
      );
    }
    return (<></>);
  }

  componentDidUpdate(prevProps: WmCalendarProps, prevState: WmCalendarState, snapshot: any) {
    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot);
    this.invokeEventCallback('onViewrender', [this, null]);
  }

  renderWidget(props: WmCalendarProps) {
    this.invokeEventCallback('onBeforerender', [null, this]);
    return (
      <View style={this.styles.root}>
        <MonthView
            date={this.state.selectedDate}
            selectDate={this.onDateChange}
            format={DEFAULT_DATE_FORMAT}
            renderChildDay={this.renderDay}
            containerStyle={this.styles.calendar}
            dateSelectedWarpDayStyle={this.styles.selectedDay}
            selectedDayTextStyle={this.styles.selectedDayText}
            warpRowWeekdays={this.styles.weekDay}
            warpRowControlMonthYear={this.styles.calendarHeader}
            weekdayStyle={this.styles.weekDayText}
            warpDayStyle={this.styles.dayWrapper}
            textDayStyle={this.styles.day}
            yearTextStyle={this.styles.yearText}
            monthTextStyle={this.styles.monthText}
            currentDayStyle={this.styles.today}
            currentDayTextStyle={this.styles.todayText}
            notDayOfCurrentMonthStyle={this.styles.notDayOfCurrentMonth}
            renderPrevYearButton={() =>
              (<WmIcon iconclass="wi wi-angle-double-left" styles={this.styles.prevYearBtn}/>)}
            renderPrevMonthButton={() =>
              (<WmIcon iconclass="wi wi-chevron-left fa-2x" styles={this.styles.prevMonthBtn}/>)}
            renderNextMonthButton={() =>
                (<WmIcon iconclass="wi wi-chevron-right fa-2x" styles={this.styles.nextMonthBtn}/>)}
            renderNextYearButton={() =>
                (<WmIcon iconclass="wi wi-angle-double-right" styles={this.styles.nextYearBtn}/>)}
          />
      </View>
    );
  }
}
