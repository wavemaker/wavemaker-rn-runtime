import React from 'react';
import { View, Text, Platform, TouchableOpacity, ViewStyle, DimensionValue, LayoutChangeEvent } from 'react-native';
import moment from 'moment';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmDatetimeProps from './datetime/datetime.props';
import { DEFAULT_CLASS, WmDatetimeStyles } from './datetime/datetime.styles';
import WebDatePicker from './date-picker.component';
import { isEqual, isNumber, isString } from 'lodash-es';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import { isDateFormatAsPerPattern, validateField ,splitBorderColorInPlace} from '@wavemaker/app-rn-runtime/core/utils';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { FloatingLabel } from '@wavemaker/app-rn-runtime/core/components/floatinglabel.component';
import AppI18nService from '@wavemaker/app-rn-runtime/runtime/services/app-i18n.service';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmDatePickerModal from './wheelpickermodal/date/date-picker-modal.component';
import WmTimePickerModal from './wheelpickermodal/time/time-picker-modal.component';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export class BaseDatetimeState extends BaseComponentState<WmDatetimeProps> {
  showDatePicker = false;
  showDatePickerModal = false;
  showTimePickerModal = false;
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
    
    // Convert moment formatting with respect to the current local.
    moment.locale(this.props.locale ?? 'en');
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
      } as any as BaseDatetimeState);
    }, 1000);
  }

  private stopCurrentTimeMonitor() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId as any);
    }
  }

  convertTimezone(date: any){ 
    const timezone = AppI18nService.getTimezone();
    if (timezone) {
      const parsedDateString = new Date(date).toLocaleString(this.props.locale ? this.props.locale : 'en-us', { timeZone: timezone });
      return moment(parsedDateString, 'M/D/YYYY, h:mm:ss A');
    }
    else {
      return null;
    }
  }

  rtlSanityCheck(text: any) {
    return text?.replace(/[\u200E\u200F\u202B\u202C]/g, '');
  }
  
  momentPattern(pattern : String) {
    const removeSpecialMarks = this.rtlSanityCheck(pattern);
    return removeSpecialMarks?.replaceAll('y', 'Y').replaceAll('d', 'D');
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    switch(name) {
      //@ts-ignore
      case 'datavalue':
        this.prevDatavalue = $old;
        if (props.datavalue === CURRENT_TIME) {
          this.monitorAndUpdateCurrentTime();
        }
      case 'datepattern':
      case 'outputformat':
        if (props.datavalue && this.momentPattern(props.outputformat as String) && this.momentPattern(props.datepattern as String)) {
          let datavalue: any = props.datavalue;
          if (datavalue === CURRENT_DATE || datavalue === CURRENT_TIME) {
            datavalue = new Date() as any;
          }
          const date = isString(datavalue) ? this.parse(datavalue as string, this.momentPattern(props.outputformat as String)) : datavalue;
          datavalue = this.convertTimezone(datavalue);

          this.updateState({
            dateValue : date,
            displayValue: this.format(datavalue?datavalue:date as any, this.momentPattern(props.datepattern as String))
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
          // * check if supplied mindate is as per datepattern
          const isMinMatchingPattern = minDateVal
            ? isDateFormatAsPerPattern(this.momentPattern(props.datepattern as String), minDateVal)
            : false;
          // * min date formatted as per datepattern
          const minDatePatternFormatted = minDateVal && isMinMatchingPattern ? moment(
            moment(
              minDateVal,
              this.momentPattern(props.datepattern as String)
            ).format('YYYY-MM-DD')
          ) : null;
          // * min date formatted as per ISO, if mindate supplied is not as per datepattern
          const formattedMinDate = minDatePatternFormatted && isMinMatchingPattern
            ? minDatePatternFormatted.toDate()
            : moment(minDateVal).toDate();
          this.updateState({
            props: {
              mindate: formattedMinDate
            }
          } as BaseDatetimeState);
        }
        break;
      case 'maxdate':
        if (isString($new)) {
          const maxDateVal = ($new === CURRENT_DATE || $new === CURRENT_TIME) ? new Date() : props.maxdate;
          // * check if supplied maxdate is as per datepattern
          const isMaxMatchingPattern = maxDateVal
            ? isDateFormatAsPerPattern(this.momentPattern(props.datepattern as String), maxDateVal)
            : false;
          // * max date formatted as per datepattern
          const maxDatePatternFormatted = maxDateVal && isMaxMatchingPattern ? moment(
            moment(
              maxDateVal,
              this.momentPattern(props.datepattern as String)
            ).format('YYYY-MM-DD')
          ) : null;
          // * max date formatted as per ISO, if maxdate supplied is not as per datepattern
          const formattedMaxDate = maxDatePatternFormatted && isMaxMatchingPattern
          ? maxDatePatternFormatted.toDate()
          : moment(maxDateVal).toDate();

          this.updateState({
            props: {
              maxdate: formattedMaxDate,
            },
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
    const prevDate = this.format(this.state.dateValue,  this.momentPattern(this.state.props.outputformat as String) as string) || undefined;
    this.modes.shift();
    const newDate = this.format(date,  this.momentPattern(this.state.props.outputformat as String) as string)
    this.updateState({
      isFocused: false,
      showDatePicker: !!this.modes.length,
      props: {
        datavalue: newDate,
        timestamp: this.format(date, 'timestamp')
      }
    } as BaseDatetimeState, () => {
      this.validate(date);
      this.invokeEventCallback('onChange', [null, this, newDate, prevDate])
    });
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
      if (this.state.props.mode === 'date') {
        this.updateState({showDatePickerModal: true} as BaseDatetimeState);
      }
      if (this.state.props.mode === 'time') {
        this.updateState({showTimePickerModal: true} as BaseDatetimeState);
      }
      if (this.state.props.mode === 'datetime') {
        this.updateState({showDatePickerModal: true} as BaseDatetimeState);
      }
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
      {...getAccessibilityProps(AccessibilityWidgetType.DATE, {...this.state.props})}
      value={this.state.dateValue || new Date()}
      is24Hour={true}
      display='default'
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

  renderNativeIOSWidget(props: WmDatetimeProps, onDismiss?: Function) {
    let date_change : any = undefined;
    return (<View style={this.styles.dialog}>
      <DateTimePicker
        mode={this.modes[0] as any}
        value={this.state.dateValue || new Date()}
        is24Hour={true}
        display='spinner'
        onChange={(event: DateTimePickerEvent, date?: Date) => {
          if (date && this.state.props.mode === 'datetime' && this.modes[0] === 'time') {
            const dateSelected = this.state.dateValue;
            date = moment(date)
              .set('month', dateSelected.getMonth())
              .set('year', dateSelected.getFullYear())
              .set('date', dateSelected.getDate())
              .toDate();
          }
          date_change = date;
        }}
        minimumDate={props.mindate as Date}
        maximumDate={props.maxdate as Date}
      />
      <View style={this.styles.actionWrapper}>
        <WmButton styles={this.styles.selectBtn} caption='Select' onTap={() => {
          this.onDateChange(null as any, date_change || this.state.dateValue || new Date());
          if (this.modes.length <= 1) {
            this.onBlur();
            onDismiss && onDismiss();
          }
        }} />
        <WmButton styles={this.styles.cancelBtn} caption='Cancel' onTap={() => {
          this.modes.shift();
          this.onDateChange(null as any, this.state.dateValue || undefined);
          this.onBlur();
          onDismiss && onDismiss();
        }} />
      </View>
    </View>
    );
  }

  renderNativeIOSWidgetWithModal(props: WmDatetimeProps) {
    return (<ModalConsumer>{(modalService: ModalService) => {
      this.nativeModalOptions.content = (<>
        {this.renderNativeIOSWidget(props, () => modalService.hideModal(this.nativeModalOptions))}
        </>);
      this.nativeModalOptions.centered = true;
      this.nativeModalOptions.onClose = () => {
        this.onBlur();
      };
      modalService.showModal(this.nativeModalOptions);
      return null;
    }}</ModalConsumer>);
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

  addTouchableOpacity(props: WmDatetimeProps, children: React.JSX.Element, styles?: any, handleLayout?: any) : React.ReactNode{
    return (
      <TouchableOpacity 
        {...this.getTestPropsForAction()} 
        onLayout={handleLayout}
        importantForAccessibility='no'
        style={styles} onPress={() => {
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

  public renderSkeleton(props: WmDatetimeProps): React.ReactNode {
    return (
      this.state.props.floatinglabel || this.state.displayValue || this.state.props.placeholder ? 
      <View style={{display:'flex',...this.styles.container,...this.styles.root}}>
        {createSkeleton(this.theme, {} as WmSkeletonStyles, {
        ...this.styles.skeleton.root
      })}
      {createSkeleton(this.theme, {} as WmSkeletonStyles, {
        ...this.styles.skeleton.icon
      })}
      </View> : null
    )}
    
  renderWidget(props: WmDatetimeProps) {
    const is12HourFormat = props?.datepattern && /hh:mm(:ss|:sss)? a/.test(props.datepattern);
    const is24Hour = is12HourFormat ? false : props.is24hour;
    let rootStyles=this.styles.root;
    let updatedRootStyles = splitBorderColorInPlace(rootStyles);
    return ( 
        this.addTouchableOpacity(props, (
        <View style={[updatedRootStyles, this.state.isValid ? {} : this.styles.invalid, this.state.isFocused ? this.styles.focused : null]} accessible={props.accessible} accessibilityLabel={props.accessibilitylabel || `Select ${props?.mode}`} accessibilityRole={props.accessibilityrole || 'button'} accessibilityHint={props.hint}>
          {this._background}
            {props.floatinglabel ? (
            <FloatingLabel
              moveUp={!!(props.datavalue || this.state.isFocused)}
              label={props.floatinglabel ?? props.placeholder} 
              style={{
                ...(this.styles.floatingLabel || []),
                ...(this.state.isFocused ? (this.styles.activeFloatingLabel || {}) : {})
              }}
              />
          ) : null}
            <View style={this.styles.container}>
              {this.addTouchableOpacity(props, (
                <Text style={[
                  this.styles.text,
                  this.state.displayValue ? {} : this.styles.placeholderText
                ]}
                {...this.getTestPropsForLabel()}>
                  {this.state.displayValue 
                    || (props.floatinglabel ? ''  : this.state.props.placeholder)}
                </Text>
              ), [this.isRTL?{flexDirection:'row', textAlign:'right'}:{}] )}
              {(!props.readonly && props.datavalue &&
                (<WmIcon iconclass="wi wi-clear"
                styles={{color: this.styles.text.color, ...this.styles.clearIcon}}
                id={this.getTestId('clearicon')}
                accessibilitylabel={`clear ${props?.mode}`}
                onTap={() => {
                  this.onDateChange(null as any, null as any);
                  this.clearBtnClicked = true;
                }}/>)) || null}
              {this.addTouchableOpacity(props, (
                <WmIcon iconclass={this.getIcon()} styles={{color: this.styles.text.color, ...this.styles.calendarIcon}} hint={props?.hint} id={this.getTestId('calendericon')} accessible={false}/>
              ))}
            </View>
          {
            this.state.showDatePicker
            && ((Platform.OS === 'web' && this.renderWebWidget(props))
              || (!props.iswheelpicker && Platform.OS === 'android' && this.renderNativeWidget(props))
              || (!props.iswheelpicker && Platform.OS === 'ios' && this.renderNativeIOSWidgetWithModal(props)))
          }
          {(Platform.OS !== 'web' && props.iswheelpicker && this.state.showDatePickerModal) && (
            <WmDatePickerModal
              isVisible={this.state.showDatePickerModal}
              onClose={() => this.updateState({showDatePickerModal: false} as BaseDatetimeState)}
              minDate={props.mindate}
              maxDate={props.maxdate}
              selectedDate={this.state.dateValue}
              onSelect={(date: Date) => {
                this.onDateChange(null as any, date);
                this.updateState({
                  isFocused: false,
                  showDatePickerModal: false
                } as BaseDatetimeState, () => {
                  setTimeout(() => {
                    this.onBlur();
                  }, 10);
                  
                  // * showing time picker after selecting date in datetime mode
                  if (this.state.props.mode === "datetime") {
                    this.setState({
                      showTimePickerModal: true,
                    })
                  }
                });
              }}
              onCancel={() => {
                // this.onDateChange(null as any, this.state.dateValue || undefined);
                this.updateState({
                  isFocused: false,
                  showDatePickerModal: false
                } as BaseDatetimeState, () => this.onBlur());
              }}
              dateheadertitle={props.dateheadertitle}
              dateconfirmationtitle={props.dateconfirmationtitle}
              datecanceltitle={props.datecanceltitle}
            />
          )}
          {(Platform.OS !== 'web' && props.iswheelpicker && this.state.showTimePickerModal) && (
            <WmTimePickerModal
              selectedDateTime={this.state.dateValue}
              is24Hour={is24Hour}
              isVisible={this.state.showTimePickerModal}
              onClose={() => this.updateState({isFocused: false, showTimePickerModal: false} as BaseDatetimeState)}
              onSelect={(time: Date) => {
                this.onDateChange(null as any, time);
                this.updateState({
                  isFocused: false,
                  showTimePickerModal: false
                } as BaseDatetimeState, () =>   {
                  setTimeout(() => {
                    this.onBlur()
                  }, 10);  
                });
              }}
              onCancel={() => {
                // this.onDateChange(null as any, this.state.dateValue || undefined);
                this.updateState({
                  isFocused: false,
                  showTimePickerModal: false
                } as BaseDatetimeState, () => {
                  this.onBlur();
                  this.modes.shift();
                });
              }}
              timeheadertitle={props.timeheadertitle}
              timeconfirmationtitle={props.timeconfirmationtitle}
              timecanceltitle={props.timecanceltitle}
            />
          )}
        </View>
        ), this.styles.rootWrapper , this.handleLayout)
    );
  }
}

