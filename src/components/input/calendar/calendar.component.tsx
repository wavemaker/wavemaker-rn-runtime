import React from 'react';
import { DimensionValue, View } from 'react-native';
import { isString } from 'lodash';
import moment, { Moment } from 'moment';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import { MonthView } from './views/month-view';
import WmCalendarProps from './calendar.props';
import { DEFAULT_CLASS, WmCalendarStyles } from './calendar.styles';
import WmIcon from '../../basic/icon/icon.component';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component'
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export class WmCalendarState extends BaseComponentState<WmCalendarProps> {
  selectedDate: Moment = moment();
  calendar: Map<String, { date: number, events: any []}> = new Map();
}

const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

export default class WmCalendar extends BaseComponent<WmCalendarProps, WmCalendarState, WmCalendarStyles> {

  constructor(props: WmCalendarProps) {
    super(props, DEFAULT_CLASS, new WmCalendarProps(), new WmCalendarState());
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

  public renderSkeleton(props: WmCalendarProps): React.ReactNode {
    return (
    <View style={[this.styles.root, this.styles.skeleton.root]}>
      <View style={this.styles.skeleton.header}>
        {createSkeleton(this.theme, {} as WmSkeletonStyles, {width: '10%', height: 28,borderRadius: 4})}
        {createSkeleton(this.theme, {} as WmSkeletonStyles, {width: '68%', height: 16, borderRadius: 4})}
        {createSkeleton(this.theme, {}as WmSkeletonStyles, {width: '10%', height: 28, borderRadius: 4})}
      </View>
      {createSkeleton(this.theme, {} as WmSkeletonStyles, {width: '96%', margin: 8, height: 320, borderRadius: 4})}
      </View>)
  } 

  renderWidget(props: WmCalendarProps) {
    this.invokeEventCallback('onBeforerender', [null, this]);
    return (
      <View style={this.styles.root}>
        {this._background}
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
              (<WmIcon id={this.getTestId('prevyearicon')} iconclass="wi wi-angle-double-left" styles={this.styles.prevYearBtn}/>)}
            renderPrevMonthButton={() =>
              (<WmIcon id={this.getTestId('prevmonthicon')} iconclass="wi wi-chevron-left fa-2x" styles={this.styles.prevMonthBtn}/>)}
            renderNextMonthButton={() =>
                (<WmIcon id={this.getTestId('nextmonthicon')} iconclass="wi wi-chevron-right fa-2x" styles={this.styles.nextMonthBtn}/>)}
            renderNextYearButton={() =>
                (<WmIcon  id={this.getTestId('nextyearicon')} iconclass="wi wi-angle-double-right" styles={this.styles.nextYearBtn}/>)}
          />
      </View>
    );
  }
}
