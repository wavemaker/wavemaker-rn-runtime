import React from 'react';
import { View, Text, Platform } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmDatetimeProps from './datetime/datetime.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmDatetimeStyles } from './datetime/datetime.styles';
import WebDatePicker from './date-picker.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isNumber, isString } from 'lodash-es';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import AppI18nService from '@wavemaker/app-rn-runtime/runtime/services/app-i18n.service';

export class BaseDatetimeState extends BaseComponentState<WmDatetimeProps> {
  showDatePicker = false;
  dateValue: Date =  null as any;
  displayValue: string = null as any;
  isFocused = false;
}

const CURRENT_DATE = 'CURRENT_DATE';
const CURRENT_TIME = 'CURRENT_TIME';

export default abstract class BaseDatetime extends BaseComponent<WmDatetimeProps, BaseDatetimeState, WmDatetimeStyles> {
  clearBtnClicked = false;
  modes = [] as string[];
  nativeModalOptions: ModalOptions = {} as any;

  constructor(props: WmDatetimeProps, defaultClass = DEFAULT_CLASS, defaultStyles = DEFAULT_STYLES, defaultProps = new WmDatetimeProps()) {
    super(props, defaultClass, defaultStyles, defaultProps);
    if (!this.state.props.datepattern) {
      this.updateFormat('datepattern', AppI18nService.dateFormat);
    }
    this.state.props.datepattern = this.state.props.datepattern?.replace(/d/g, 'D');
    this.state.props.outputformat = this.state.props.outputformat?.replace(/d/g, 'D');
    this.state.props.datepattern = this.state.props.datepattern?.replace(/E/g, 'd');
    this.state.props.outputformat = this.state.props.outputformat?.replace(/E/g, 'd');
  }

  format(date: Date | number | undefined, format: string) {
    if (format === 'timestamp') {
      return date instanceof Date ? '' + date.getTime() : date;
    }
    return date && moment(date).format(format);
  }
  updateFormat(pattern: string, val: string) {
    if (pattern === 'datepattern') {
      this.state.props.datepattern = val;
      this.state.props.datepattern = this.state.props.datepattern.replace(/d/g, 'D');
    }
  }
  parse(date: string | number, format: string) {
    if (format === 'timestamp') {
      if (isString(date)) {
        return new Date(parseInt(date));
      }
      if (isNumber(date)) {
        return new Date(date);
      }
    }
    return date && moment(date, format).toDate();
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    switch(name) {
      //@ts-ignore
      case 'datavalue':
        this.invokeEventCallback('onChange', [null, this, $new, $old]);
        this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old);
      case 'datepattern':
      case 'outputformat':
        if (props.datavalue && props.outputformat && props.datepattern) {
          if (props.datavalue === CURRENT_DATE || props.datavalue === CURRENT_TIME) {
            props.datavalue = this.format(new Date(), props.outputformat);
          }
          const date = this.parse(props.datavalue as string, props.outputformat);
          this.updateState({
            dateValue : date,
            displayValue: this.format(date as any, props.datepattern)
          } as BaseDatetimeState);
        } else {
          this.updateState({
            dateValue : null as any,
            displayValue: null as any
          } as BaseDatetimeState);
        }
        break;
      case 'mindate':
        if (isString($new)) {
          const minDateVal = ($new === CURRENT_DATE || $new === CURRENT_TIME) ? new Date() : props.mindate;
          this.updateState({
            props: {
              mindate: moment(minDateVal, 'YYYY-MM-DD').toDate()
            }
          } as BaseDatetimeState);
        }
        break;
      case 'maxdate':
        if (isString($new)) {
          const maxDateVal = ($new === CURRENT_DATE || $new === CURRENT_TIME) ? new Date() : props.maxdate;
          this.updateState({
            props: {
              maxdate: moment(maxDateVal, 'YYYY-MM-DD').toDate()
            }
          } as BaseDatetimeState);
        }
        break;
    }
  }

  onDateChange($event: Event, date?: Date) {
    this.modes.shift();
    this.updateState({
      isFocused: false,
      showDatePicker: !!this.modes.length,
      props: {
        datavalue: this.format(date, this.state.props.outputformat as string)
      }
    } as BaseDatetimeState);
  }

  onBlur() {
    this.invokeEventCallback('onBlur', [null, this]);
  }

  onFocus() {
    if (Platform.OS !== 'web' && this.state.props.mode === 'datetime') {
      this.modes = ['date', 'time'];
    } else {
      this.modes = [this.state.props.mode];
    }
    this.updateState({showDatePicker: true, isFocused: true} as BaseDatetimeState);
    this.invokeEventCallback('onFocus', [null, this]);
  }

  renderWebWidget(props: WmDatetimeProps)  {
    return (<WebDatePicker
      mode={this.state.props.mode}
      value={this.state.dateValue || new Date()}
      onDateChange={(date: Date) => this.onDateChange(null as any, date)}
      onDismiss={() =>
        this.updateState({
          isFocused: false,
          showDatePicker: false
        } as BaseDatetimeState, () => this.onBlur())}
      minimumDate={props.mindate as Date}
      maximumDate={props.maxdate as Date}/>);
  }

  renderNativeWidget(props: WmDatetimeProps, onDismiss?: Function) {
    return (<DateTimePicker
      mode={this.modes[0] as any}
      value={this.state.dateValue || new Date()}
      is24Hour={true}
      display="default"
      onChange={(event: Event, date?: Date) => {
        if (this.modes.length <= 1) {
          this.onBlur();
          onDismiss && onDismiss();
        }
        this.onDateChange(event, date || this.state.dateValue);
      }}
      minimumDate={props.mindate as Date}
      maximumDate={props.maxdate as Date}
    />
    );
  }

  renderNativeWidgetWithModal(props: WmDatetimeProps) {
    return (<ModalConsumer>{(modalService: ModalService) => {
      this.nativeModalOptions.content = (<>
        {this.renderNativeWidget(props, () => modalService.hideModal(this.nativeModalOptions))}
        <Text>HELLO</Text>
        </>);
      this.nativeModalOptions.centered = true;
      this.nativeModalOptions.onClose = () => {
        this.onBlur();
      };
      modalService.showModal(this.nativeModalOptions);
      return null;
    }}</ModalConsumer>);
  }

  renderWidget(props: WmDatetimeProps) {
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
            {(!props.readonly && props.datavalue &&
              (<WmIcon iconclass="wi wi-clear"
              styles={{color: this.styles.text.color, ...this.styles.clearIcon}}
              onTap={() => {
                this.onDateChange(null as any, null as any);
                this.clearBtnClicked = true;
              }}/>)) || null}
            <WmIcon iconclass="wi wi-calendar" styles={{color: this.styles.text.color, ...this.styles.calendarIcon}}/>
          </View>
        </TouchableOpacity>
        {
          this.state.showDatePicker
          && ((Platform.OS === 'web' && this.renderWebWidget(props))
            || (Platform.OS === 'android' && this.renderNativeWidget(props))
            || (Platform.OS === 'ios' && this.renderNativeWidget(props)))
        }
      </View>
    );
  }
}

