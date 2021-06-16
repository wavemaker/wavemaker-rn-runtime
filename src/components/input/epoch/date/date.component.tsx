import React from 'react';
import { View, Text, Platform } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmDateProps from './date.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmDateStyles } from './date.styles';
import WebDatePicker from '../date-picker.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isString } from 'lodash-es';

export class WmDateState extends BaseComponentState<WmDateProps> {
  showDatePicker = false;
  dateValue: Date =  null as any;
  displayValue: string = null as any;
  isFocused = false;
}


export default class WmDate extends BaseComponent<WmDateProps, WmDateState, WmDateStyles> {
  clearBtnClicked = false;

  constructor(props: WmDateProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmDateProps());
    this.state.props.defaultvalue  = this.state.props.datavalue;
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    switch(name) {
      //@ts-ignore
      case 'datavalue':
        this.invokeEventCallback('onChange', [null, this, $new, $old]);
      case 'datepattern':
      case 'outputpattern':
        if (props.datavalue && props.outputpattern && props.datepattern) {
          if (props.datavalue === 'CURRENT_DATE') {
            props.datavalue = moment(Date.now()).format(props.outputpattern);
          }
          const date = moment(props.datavalue, props.outputpattern).toDate();
          this.updateState({
            dateValue : date,
            displayValue: moment(date).format(props.datepattern)
          } as WmDateState);
        } else {
          this.updateState({
            dateValue : null as any,
            displayValue: null as any
          } as WmDateState);
        }
        break;
      case 'mindate':
        if (isString($new)) {
          this.updateState({
            props: {
              mindate: moment(props.mindate, 'YYYY-MM-DD').toDate()
            }
          } as WmDateState);
        }
        break;
      case 'maxdate':
        if (isString($new)) {
          this.updateState({
            props: {
              maxdate: moment(props.maxdate, 'YYYY-MM-DD').toDate()
            }
          } as WmDateState);
        }
        break;
    }
  }

  onDateChange($event: Event, date?: Date) {
    this.updateState({
      isFocused: false,
      showDatePicker: false,
      props: {
        datavalue: date && moment(date).format(this.state.props.outputpattern)
      }
    } as WmDateState, () => this.onBlur());
  }

  renderWebWidget(props: WmDateProps)  {
    return (<WebDatePicker 
      value={this.state.dateValue || new Date()}
      onDateChange={(date: Date) => this.onDateChange(null as any, date)}
      onDismiss={() => 
        this.updateState({
          isFocused: false,
          showDatePicker: false
        } as WmDateState, () => this.onBlur())}
      minimumDate={props.mindate as Date}
      maximumDate={props.maxdate as Date}/>); 
  }

  onBlur() {
    this.invokeEventCallback('onBlur', [null, this]);
  }

  onFocus() {
    this.updateState({showDatePicker: true, isFocused: true} as WmDateState);
    this.invokeEventCallback('onFocus', [null, this]);
  }

  renderWidget(props: WmDateProps) {
    return (
      <View style={[this.styles.root, this.state.isFocused ? this.styles.focused : null]}>
        <TouchableOpacity onPress={() => {
          if (!props.readonly && !this.clearBtnClicked) {
            this.onFocus(); 
          }
          this.clearBtnClicked = false;
          this.invokeEventCallback('onTap', [null, this]);
        }}>
          <View style={this.styles.container}>
            <Text style={this.styles.text}>{this.state.displayValue || this.state.props.placeholder}</Text>
            {!props.readonly && props.datavalue &&
              (<WmIcon iconclass="wi wi-clear" 
              styles={{color: this.styles.text.color, ...this.styles.clearIcon}}
              onTap={() => {
                this.onDateChange(null as any, null as any);
                this.clearBtnClicked = true;
              }}/>)}
            <WmIcon iconclass="wi wi-calendar" styles={{color: this.styles.text.color, ...this.styles.calendarIcon}}/>
          </View>
        </TouchableOpacity>
        {
          this.state.showDatePicker 
          && (Platform.OS === 'web' ? this.renderWebWidget(props) : (<DateTimePicker
              mode="date"
              value={this.state.dateValue || new Date()}
              is24Hour={true}
              display="default"
              onChange={(event: Event, date?: Date) => this.onDateChange(event, date)}
              minimumDate={props.mindate as Date}
              maximumDate={props.maxdate as Date}
            />
          ))
        }
      </View>
    ); 
  }
}

