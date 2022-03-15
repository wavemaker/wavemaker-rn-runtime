import { includes, intersection, isNaN, isFinite, toArray } from 'lodash';
import BaseNumberProps from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.props';
import { BaseComponent, BaseComponentState } from "@wavemaker/app-rn-runtime/core/base.component";
import { BaseNumberStyles } from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.styles';
import { DEFAULT_CLASS, DEFAULT_STYLES } from "@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.styles";
import { Platform, TextInput } from 'react-native';

export class BaseNumberState <T extends BaseNumberProps> extends BaseComponentState<T> {
  isValid: boolean = true;
  textValue: string = '';
  isDefault = false;
}

export abstract class BaseNumberComponent< T extends BaseNumberProps, S extends BaseNumberState<T>, L extends BaseNumberStyles> extends BaseComponent<T, S, L> {
  private DECIMAL;
  private GROUP;
  public widgetRef: TextInput | null = null;
  private cursor: any = 0;
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles, defaultProps, defaultState);
    this.DECIMAL = '.';
    this.GROUP = ',';
  }

  onChange(event: any) {
    if (this.state.props.updateon === 'default') {
      this.updateDatavalue(event.target.value, event);
    }
  }

  focus() {
    this?.widgetRef?.focus();
  }

  onChangeText(value: any) {
    this.updateState({
        textValue: value
      } as S, () => {
        if (this.state.props.updateon === 'default') {
          this.updateDatavalue(value, null);
          this.props.onFieldChange &&
          this.props.onFieldChange(
            'datavalue',
            value,
            this.state.props.datavalue
          );
        }
      }
    );
  }

  invokeChange(e: any) {
    if (Platform.OS === 'web') {
      this.cursor = e.target.selectionStart;
      this.setState({ textValue: e.target.value });
    }
  }

  handleValidation(value: any) {
    const props = this.state.props;
    if (props.regexp) {
      const condition = new RegExp(props.regexp, 'g');
      return condition.test(value);
    }
    return true;
  }

  /**
   * Method parses the Localized number(string) to a valid number.
   * if the string dose not result to a valid number then returns NaN.
   * @param {string} val Localized number.
   * @returns {number}
   */
  private parseNumber(val: string): any {
    // splits string into two parts. decimal and number.
    const parts = val.split(this.DECIMAL);
    if (!parts.length) {
      return;
    }
    if (parts.length > 2) {
      return NaN;
    }
    // If number have decimal point and not have a decimal value then return.
    if (parts[1] === '') {
      return NaN;
    }
    // replaces all group separators form the number.
    const number = Number(parts[0].split(this.GROUP).join(''));
    const decimal = Number(`0.${parts[1] || 0}`);
    if (Number.isNaN(number) || Number.isNaN(decimal)) {
      return NaN;
    }
    const sum = parts.length > 1 ? parseFloat((number + decimal).toFixed(parts[1].length)) : number + decimal;
    // if the number is negative then calculate the number as number - decimal
    // Ex: number = -123 and decimal = 0.45 then number - decimal = -123-045 = -123.45
    // If entered number is -0.1 to -0.9 then the number is -0 and decimal is 0.1 to 0.9. Now calaculate the number as number-decimal
    // Ex: number = -0 and decimal = 0.1 then number-decimal = -0-0.1 = -0.1
    if (number === 0) {
      return Object.is(0, number) ? sum : number - decimal;
    }
    return number > 0 ? sum : number - decimal;
  }

  updateDatavalue(value: any, event?: any, source?: any) {
    const model = value && this.parseNumber(value.toString());
    const props = this.state.props;
    const oldValue = props.datavalue;
    if (value === oldValue) {
      return;
    }
    const validNumber = this.isValidNumber(model);
    if (!validNumber) {
      this.invokeEventCallback('onError', [ event, this.proxy, value, oldValue ]);
      return;
    }

    this.updateState({
      props: {
        datavalue: model
      }
    } as S, () => {
      !this.props.onFieldChange && value !== oldValue && this.invokeEventCallback('onChange', [event, this.proxy, value, oldValue]);
      if (source === 'blur') {
        this.invokeEventCallback('onBlur', [event, this.proxy]);
      }
    });
  }

  onBlur(event: any) {
    if (this.state.props.updateon === 'blur') {
      let newVal = event.target.value || this.state.textValue;
      let oldVal = this.state.props.datavalue || '';
      if (oldVal !== newVal) {
        this.updateDatavalue(newVal, event, 'blur');
      } else {
        this.invokeEventCallback('onBlur', [event, this.proxy]);
      }
    }
  }

  onFocus(event: any) {
    this.invokeEventCallback('onFocus', [ event, this.proxy]);
  }

  /**
   * returns the number of decimal places a number have.
   * @param value: number
   * @returns {number}
   */
  private countDecimals(value: any) {
    if (value && ((value % 1) !== 0)) {
      const decimalValue = value.toString().split('.')[1];
      return decimalValue && decimalValue.length;
    }
    return 0;
  }

  public validateInputEntry($event: any) {
    const props = this.state.props;

    // allow actions if control key is pressed or if backspace is pressed. (for Mozilla).
    if ($event.ctrlKey || includes(['Backspace', 'ArrowRight', 'ArrowLeft', 'Tab', 'Enter', 'Delete'], $event.key)) {
      return;
    }

    const validity = new RegExp(`^[\\d\\s-,.e+${this.GROUP}${this.DECIMAL}]$`, 'i');
    const inputValue = $event.target.value;
    // validates entering of decimal values only when user provides decimal limit(i.e step contains decimal values).
    if (inputValue && this.countDecimals(props.step) && (this.countDecimals(inputValue) >= this.countDecimals(props.step))) {
      $event.preventDefault();
    }
    // validates if user entered an invalid character.
    if (!validity.test($event.key)) {
      $event.preventDefault();
    }
    // a decimal value can be entered only once in the input.
    if (includes(inputValue, this.DECIMAL) && $event.key === this.DECIMAL) {
      $event.preventDefault();
    }
    // 'e' can be entered only once in the input.
    if (intersection(toArray(inputValue), ['e', 'E']).length && includes('eE', $event.key)) {
      $event.preventDefault();
    }
    if ((includes(inputValue, '+') || includes(inputValue, '-')) && ($event.key === '+' || $event.key === '-')) {
      $event.preventDefault();
    }
    this.invokeEventCallback('onKeypress', [ $event, this.proxy]);
  }

  /**
   * returns a valid number by validating the minimum and maximum values.
   * @param {number} value
   * @returns {number}
   */
  private getValueInRange(value: number): number {
    const props = this.state.props;
    if (!props.minvalue || !props.maxvalue) {
      return value;
    }
    if (!isNaN(props.minvalue) && value < props.minvalue) {
      return props.minvalue;

    }
    if (!isNaN(props.maxvalue) && value > props.maxvalue) {
      return props.maxvalue;
    }
    return value;
  }

  /**
   * Adds validations for the number before updating the widget model. like validating min and max value for the widget.
   * @param {number} val number to be validated
   * @returns {number}
   */
  private isValidNumber(val: number): boolean {
    const props = this.state.props;

    //empty number widget should not show validation error when required is false
    // @ts-ignore
    if (this.state.props.required === false && val === '') {
      return true;
    }
    // id number is infinite then consider it as invalid value
    if (isNaN(val) || !isFinite(val) || (!Number.isInteger(props.step) &&
      this.countDecimals(val) > this.countDecimals(props.step))) {
      this.updateState({
        isValid: false,
      } as S);
      return false;
    }
    if (val !== this.getValueInRange(val)) {
      this.updateState({
        isValid: false,
      } as S);
      return true;
    }
    // regex validation
    if (!this.handleValidation(val)) {
      this.updateState({
        isValid: false,
      } as S);
      return false;
    }
    this.resetValidations();
    return true;
  }

  // resets all the flags related to the widget's validation.
  protected resetValidations() {
    this.updateState({
      isValid: true,
    } as S);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'minvalue':
      case 'maxvalue':
        if ($new|| $old) {
          this.isValidNumber($new);
        }
        break;
      case 'datavalue':
        this.updateState({
            textValue: $new
          } as S
        );
        const isDefault = this.state.isDefault;
        if (isDefault) {
          this.updateState({ isDefault: false } as S, this.props.onFieldChange && this.props.onFieldChange.bind(this, 'datavalue', $new, $old, isDefault));
        } else {
          this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old, isDefault);
        }
    }
  }
}
