import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmDatetimeProps from './datetime/datetime.props';
import { DEFAULT_CLASS, WmDatetimeStyles } from './datetime/datetime.styles';
import WebDatePicker from './date-picker.component';
import { isNumber, isString } from 'lodash-es';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import { validateField } from '@wavemaker/app-rn-runtime/core/utils';

export class BaseDatetimeState extends BaseComponentState<WmDatetimeProps> {
  showDatePicker = false;
  dateValue: Date =  null as any;
  displayValue: string = null as any;
  isFocused = false;
  timerId: NodeJS.Timer = null as any;
  isValid: boolean = true;
  errorType = '';
}

const CURRENT_DATE = 'CURRENT_DATE';
const CURRENT_TIME = 'CURRENT_TIME';

export default abstract class BaseDatetime extends BaseComponent<WmDatetimeProps, BaseDatetimeState, WmDatetimeStyles> {
  clearBtnClicked = false;
  modes = [] as string[];
  nativeModalOptions: ModalOptions = {} as any;
  prevDatavalue: any;

  constructor(props: WmDatetimeProps, defaultClass = DEFAULT_CLASS, defaultProps = new WmDatetimeProps(), defaultState= new BaseDatetimeState()) {
    super(props, defaultClass, defaultProps, defaultState);
  }

  format(date: Date | number | undefined, format: string) {
    if (format === 'timestamp') {
      return date instanceof Date ? '' + date.getTime() : date;
    }
    return date && moment(date).format(format);
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

  private monitorAndUpdateCurrentTime() {
    this.stopCurrentTimeMonitor();
    const timerId = setInterval(() => {
      this.updateState({
        props: {
          readonly: true,
          datavalue: Date.now()
        },
        timerId: timerId
      } as BaseDatetimeState);
    }, 1000);
  }

  private stopCurrentTimeMonitor() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    switch(name) {
      //@ts-ignore
      case 'datavalue':
        this.invokeEventCallback('onChange', [null, this, $new, $old]);
        this.prevDatavalue = $old;
        if (props.datavalue === CURRENT_TIME) {
          this.monitorAndUpdateCurrentTime();
        }
      case 'datepattern':
      case 'outputformat':
        if (props.datavalue && props.outputformat && props.datepattern) {
          if (props.datavalue === CURRENT_DATE || props.datavalue === CURRENT_TIME) {
            props.datavalue = this.format(new Date(), props.outputformat);
          }
          const date = isString(props.datavalue) ? this.parse(props.datavalue as string, props.outputformat) : props.datavalue;
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
        this.props.onFieldChange && this.props.onFieldChange('datavalue', props.datavalue, this.prevDatavalue);
        break;
      case 'mindate':
        if (isString($new)) {
          const minDateVal = ($new === CURRENT_DATE || $new === CURRENT_TIME) ? new Date() : props.mindate;
          this.updateState({
            props: {
              mindate: moment(minDateVal, props.datepattern).toDate()
            }
          } as BaseDatetimeState);
        }
        break;
      case 'maxdate':
        if (isString($new)) {
          const maxDateVal = ($new === CURRENT_DATE || $new === CURRENT_TIME) ? new Date() : props.maxdate;
          this.updateState({
            props: {
              maxdate: moment(maxDateVal, props.datepattern).toDate()
            }
          } as BaseDatetimeState);
        }
        break;
      case 'readonly':
        this.updateState({
          props: {
            disabled: $new
          }
        } as BaseDatetimeState)
        break;
    }
  }

  onDateChange($event: DateTimePickerEvent, date?: Date) {
    this.validate(date);
    this.modes.shift();
    this.updateState({
      isFocused: false,
      showDatePicker: !!this.modes.length,
      props: {
        datavalue: this.format(date, this.state.props.outputformat as string),
        timestamp: this.format(date, 'timestamp')
      }
    } as BaseDatetimeState);
  }

  onBlur() {
    if (Platform.OS === 'web') {
      this.validate(this.state.props.datavalue);
      setTimeout(() => this.props.triggerValidation && this.props.triggerValidation());
    }
    this.invokeEventCallback('onBlur', [null, this]);
  }

  onFocus() {
    if (!this.state.props.readonly) {
      if (Platform.OS !== 'web' && this.state.props.mode === 'datetime') {
        this.modes = ['date', 'time'];
      } else {
        this.modes = [this.state.props.mode];
      }
      this.updateState({showDatePicker: true, isFocused: true} as BaseDatetimeState);
      this.invokeEventCallback('onFocus', [null, this]);
    }
  }

  validate(value: any) {
    const validationObj = validateField(this.state.props, value);
    this.setState({
      isValid: validationObj.isValid,
      errorType: validationObj.errorType
    } as BaseDatetimeState)
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.stopCurrentTimeMonitor();
  }

  renderWebWidget(props: WmDatetimeProps) {
    return (<WebDatePicker
      mode={this.state.props.mode}
      locale={props.locale}
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
      display={Platform.OS === 'ios' ? 'spinner': 'default'}
      onChange={(event: DateTimePickerEvent, date?: Date) => {
        if (date && this.state.props.mode === 'datetime' && this.modes[0] === 'time') {
          const dateSelected = this.state.dateValue;
          date = moment(date)
            .set('month', dateSelected.getMonth())
            .set('year', dateSelected.getFullYear())
            .set('date', dateSelected.getDate())
            .toDate();
        }
        this.onDateChange(event, date || this.state.dateValue);
        if (this.modes.length <= 1) {
          this.onBlur();
          onDismiss && onDismiss();
        }
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
        </>);
      this.nativeModalOptions.centered = true;
      this.nativeModalOptions.onClose = () => {
        this.onBlur();
      };
      modalService.showModal(this.nativeModalOptions);
      return null;
    }}</ModalConsumer>);
  }

  addTouchableOpacity(props: WmDatetimeProps, children: React.ReactNode, styles?: any) : React.ReactNode{
    return (
      <TouchableOpacity style={styles} onPress={() => {
        if (!props.readonly) {
          this.onFocus();
        }
        this.invokeEventCallback('onTap', [null, this]);
      }}>
        {children}
      </TouchableOpacity>
    );
  }

  getIcon() {
    if (this.state.props.mode === 'time') {
      return 'wm-sl-l sl-time'
    }
    return 'wm-sl-l sl-calendar';
  }

  renderWidget(props: WmDatetimeProps) {
    return ( 
        this.addTouchableOpacity(props, (
        <View style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid, this.state.isFocused ? this.styles.focused : null]}>
          {this._background}
            <View style={this.styles.container}>
              {this.addTouchableOpacity(props, (
                <Text style={[
                  this.styles.text,
                  this.state.displayValue ? {} : this.styles.placeholderText
                ]}>{this.state.displayValue || this.state.props.placeholder}</Text>
              ), { flex: 1 })}
              {(!props.readonly && props.datavalue &&
                (<WmIcon iconclass="wi wi-clear"
                styles={{color: this.styles.text.color, ...this.styles.clearIcon}}
                onTap={() => {
                  this.onDateChange(null as any, null as any);
                  this.clearBtnClicked = true;
                }}/>)) || null}
              {this.addTouchableOpacity(props, (
                <WmIcon iconclass={this.getIcon()} styles={{color: this.styles.text.color, ...this.styles.calendarIcon}}/>
              ))}
            </View>
          {
            this.state.showDatePicker
            && ((Platform.OS === 'web' && this.renderWebWidget(props))
              || (Platform.OS === 'android' && this.renderNativeWidget(props))
              || (Platform.OS === 'ios' && this.renderNativeWidget(props)))
          }
        </View>
        ))
    );
  }
}

