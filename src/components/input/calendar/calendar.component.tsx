import React from 'react';
import { Text, View } from 'react-native';
import Color from 'color';
import { isString } from 'lodash';
import moment, { Moment } from 'moment';
import CalendarPicker, { CustomDateStyle } from 'react-native-calendar-picker';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCalendarProps from './calendar.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCalendarStyles } from './calendar.styles';
import WmIcon from '../../basic/icon/icon.component';

export class WmCalendarState extends BaseComponentState<WmCalendarProps> {
  selectedDate: Moment = moment();
  calendar: Map<String, { date: number, events: any []}> = null as any;
}

const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

export default class WmCalendar extends BaseComponent<WmCalendarProps, WmCalendarState, WmCalendarStyles> {

  constructor(props: WmCalendarProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCalendarProps(), new WmCalendarState());
  }

  onDateChange = (date: Moment) => {
    const dateWindow = this.state.calendar.get(moment(date).format(DEFAULT_DATE_FORMAT));
    const d = date.toDate();
    this.updateState({
      props: {datavalue: moment(date).format(DEFAULT_DATE_FORMAT)},
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

  getDateStyles(date: Moment) {
    const dateWindow = this.state.calendar.get(moment(date).format(DEFAULT_DATE_FORMAT));
    let styles = {} as CustomDateStyle;
    if (dateWindow) {
      styles = {
        date: date.toISOString(),
        containerStyle: {
          borderBottomWidth: 3,
          borderColor: this.styles['eventDay' + Math.min(3, dateWindow.events.length)].borderColor,
          borderStyle: 'solid'
        }
      } as CustomDateStyle;
    }
    if (date.isSame(this.state.selectedDate)) {
      styles = deepCopy(styles, {
        date: date.toISOString(),
        containerStyle: this.styles.selectedDay,
        textStyle: this.styles.selectedDayText
      } as CustomDateStyle);
    }
    return styles;
  }

  getDatesStyles() {
    let date = this.state.selectedDate.clone().subtract(7, 'day');
    const customStyles = [];
    for (let i = 0; i < 35; i++) {
      customStyles.push(this.getDateStyles(date));
      date = date.add(1, 'day');
    }
    return customStyles;
  }

  componentDidUpdate(prevProps: WmCalendarProps, prevState: WmCalendarState, snapshot: any) {
    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot);
    this.invokeEventCallback('onViewrender', [this, null]);
  }

  renderWidget(props: WmCalendarProps) {

    this.invokeEventCallback('onBeforerender', [null, this]);
    return (
    <View style={this.styles.root}>
      <CalendarPicker
          initialDate={(this.state.selectedDate || moment()) as any}
          previousComponent={(
            <WmIcon
              iconclass="wi wi-chevron-left fa-2x"
              styles={this.styles.prevBtn}/>
          )}
          nextComponent={(
            <WmIcon
              iconclass="wi wi-chevron-right fa-2x"
              styles={this.styles.nextBtn}/>
          )}
          customDatesStyles={this.getDatesStyles()}
          customDayHeaderStyles={() => ({
            style: this.styles.week,
            textStyle: this.styles.week
          })}
          onMonthChange={this.onDateChange}
          dayShape='square'
          selectedDayColor="rgba(0, 0, 0, 0)"
          todayBackgroundColor={Color(this.styles.selectedDay.backgroundColor).lighten(0.5).toString()}
          todayTextStyle={this.styles.today}
          monthTitleStyle={this.styles.title}
          yearTitleStyle={this.styles.title}
          showDayStragglers={true}
          onDateChange={this.onDateChange}
        />
    </View>
  ); 
  }
}
