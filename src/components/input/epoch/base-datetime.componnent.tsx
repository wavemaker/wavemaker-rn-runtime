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
import { isString } from 'lodash-es';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';

export class BaseDatetimeState extends BaseComponentState<WmDatetimeProps> {
  showDatePicker = false;
  dateValue: Date =  null as any;
  displayValue: string = null as any;
  isFocused = false;
}


export default abstract class BaseDatetime extends BaseComponent<WmDatetimeProps, BaseDatetimeState, WmDatetimeStyles> {
  clearBtnClicked = false;
  modes = [] as string[];
  nativeModalOptions: ModalOptions = {} as any;

  constructor(props: WmDatetimeProps, defaultClass = DEFAULT_CLASS, defaultStyles = DEFAULT_STYLES, defaultProps = new WmDatetimeProps()) {
    super(props, defaultClass, defaultStyles, defaultProps);
    this.state.props.datepattern = this.state.props.datepattern?.replace(/d/g, 'D');
    this.state.props.outputformat = this.state.props.outputformat?.replace(/d/g, 'D');
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    switch(name) {
      //@ts-ignore
      case 'datavalue':
        this.invokeEventCallback('onChange', [null, this, $new, $old]);
      case 'datepattern':
      case 'outputformat':
        if (props.datavalue && props.outputformat && props.datepattern) {
          let date = new Date();
          if (props.datavalue === 'CURRENT_DATE' || props.datavalue === 'CURRENT_TIME') {
            if (props.outputformat === 'timestamp') {
              props.datavalue = new Date();
            } else {
              props.datavalue = moment(Date.now()).format(props.outputformat);
            }
          }
          date = isString(props.datavalue) ? moment(props.datavalue, props.outputformat).toDate() : props.datavalue;
          this.updateState({
            dateValue : date,
            displayValue: moment(date).format(props.datepattern)
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
          this.updateState({
            props: {
              mindate: moment(props.mindate, 'YYYY-MM-DD').toDate()
            }
          } as BaseDatetimeState);
        }
        break;
      case 'maxdate':
        if (isString($new)) {
          this.updateState({
            props: {
              maxdate: moment(props.maxdate, 'YYYY-MM-DD').toDate()
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
        datavalue: date && moment(date).format(this.state.props.outputformat)
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
      this.nativeModalOptions.contentStyle = {
        width: 400,
        height: 300
      }
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
          && ((Platform.OS === 'web' && this.renderWebWidget(props))
            || (Platform.OS === 'android' && this.renderNativeWidget(props))
            || (Platform.OS === 'ios' && this.renderNativeWidget(props)))
        }
      </View>
    ); 
  }
}

