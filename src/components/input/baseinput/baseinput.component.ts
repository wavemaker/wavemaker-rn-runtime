import { DEFAULT_CLASS, DEFAULT_STYLES } from "@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.styles";
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import BaseInputProps from './baseinput.props';
import { isString } from 'lodash';
import { BaseInputStyles } from './baseinput.styles';


export class BaseInputState <T extends BaseInputProps> extends BaseComponentState<T> {
  keyboardType: any = 'default';
  isValid: boolean = true;
}

export abstract class BaseInputComponent< T extends BaseInputProps, S extends BaseInputState<T>, L extends BaseInputStyles> extends BaseComponent<T, S, L> {

  isTouched: boolean = false;
  textValue: any = '';
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles, defaultProps, defaultState);
  }


  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'type':
        let keyboardType;
        if (this.props.type === 'number') {
          keyboardType = 'numeric';
        } else if (this.props.type === 'tel') {
          keyboardType = 'phone-pad';
        } else if (this.props.type === 'email') {
          keyboardType = 'email-address';
        }
        this.updateState({
          keyboardType: keyboardType,
        } as S);
        break;
      case 'datavalue':
        this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old);
    }
  }

  onChange(event: any) {
    if (this.state.props.updateon === 'default') {
      this.updateDatavalue(event.target.value, event);
    }
  }

  onChangeText(value: any) {
    this.textValue = value;
    if (this.state.props.updateon === 'default') {
      this.updateDatavalue(value, null);
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

  updateDatavalue(value: any, event?: any, source?: any) {
    const props = this.state.props;
    const oldValue = props.datavalue;

    // autotrim
    if (props.autotrim && props.datavalue && isString(props.datavalue)) {
      value = value.trim();
    }

    // regex validation
    const valid = this.handleValidation(value);
    const isValid = this.props.required && source && !value ? false : true;
    this.updateState({
      isValid: isValid
    } as S);
    if (!valid) {
      this.invokeEventCallback('onError', [ event, this.proxy, value, oldValue ]);
      return;
    }

    this.updateState({
      props: {
        datavalue: value
      }
    } as S, () => this.invokeEventCallback('onChange', [ event, this.proxy, value, oldValue ]))

  }

  onBlur(event: any) {
    this.isTouched = true;
    if (this.state.props.updateon === 'blur') {
      this.updateDatavalue(event.target.value || this.textValue, event, 'blur');
    }

    this.invokeEventCallback('onBlur', [ event, this.proxy]);
  }

  check() {
    this.isTouched = true;
    const isValid = this.props.required && !this.state.props.datavalue ? false : true;
    this.updateState({
      isValid: isValid
    } as S);
  }

  onFocus(event: any) {
    this.invokeEventCallback('onFocus', [ event, this.proxy]);
  }

  onKeyPress(event: any) {
    this.invokeEventCallback('onKeypress', [ event, this.proxy]);
  }
}