import { DEFAULT_CLASS } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.styles';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import BaseInputProps from './baseinput.props';
import { isString } from 'lodash';
import { BaseInputStyles } from './baseinput.styles';
import { Platform, TextInput } from 'react-native';
import { validateField } from '@wavemaker/app-rn-runtime/core/utils';
import Injector from '@wavemaker/app-rn-runtime/core/injector';

export class BaseInputState <T extends BaseInputProps> extends BaseComponentState<T> {
  keyboardType: any = 'default';
  isValid: boolean = true;
  isInputFocused: boolean = false;
  textValue: string = '';
  isDefault = false;
  errorType: string = '';
}
export abstract class BaseInputComponent< T extends BaseInputProps, S extends BaseInputState<T>, L extends BaseInputStyles> extends BaseComponent<T, S, L> {
  public widgetRef: TextInput | null = null;
  isTouched: boolean = false;
  private cursor: any = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultProps, defaultState);
  }
  public charlength:number = 0;

  focus() {
    this?.widgetRef?.focus();
  }

  blur() {
    this?.widgetRef?.blur && this?.widgetRef?.blur();
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
        this.updateState({
            textValue: $new
          } as S
        );
        
        const isDefault = this.state.props.isdefault;
        if (isDefault) {
          this.updateState(
            { props: {isdefault: false} } as S, 
            !this.state.props.skipscripteventtrigger && this.props.onFieldChange && this.props.onFieldChange.bind(this, 'datavalue', $new, $old, isDefault)
          );
        } 
        else {
          !this.state.props.skipscripteventtrigger && this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old, isDefault);
        }
    }
  }

  onChange(event: any) {
    if (this.state.props.updateon === 'default') {
      this.updateDatavalue(event.target.value, event);
    }else if(this.state.props.updateon === 'lazy') {
      if(this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.updateDatavalue(event.target.value, event);
      }, 300)
    }
  }

  onChangeText(value: any) {
    this.charlength = value?.length;
    if(this.state.props.updateon === 'lazy') {
      if(this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.updateState({
          textValue: value
        } as S, () => {
          this.validate(value);
          this.updateDatavalue(value, null);
          }
        );
      }, 300)
    }
    else {
      this.updateState({
          textValue: value
        } as S, () => {
          if (this.state.props.updateon === 'default') {
            this.validate(value);
            this.updateDatavalue(value, null);
          }
        }
      );
    }
  }

  invokeChange(e: any) {
    if (Platform.OS === 'web') {
      this.cursor = e.target.selectionStart;
      this.setState({ textValue: e.target.value });
    }
  }

  updateDatavalue(value: any, event?: any, source?: any) {
    const props = this.state.props;
    const oldValue = props.datavalue;
    if (value === oldValue) {
      return;
    }

    // autotrim
    if (props.autotrim && props.datavalue && isString(props.datavalue)) {
      value = value.trim();
    }
    new Promise((resolve) => {
      if (props.hastwowaybinding) {
        this.setProp("datavalue", value);
        this.updateState({props: { "datavalue": value }} as S);
        resolve(true);
      } else {
        this.updateState({
          props: {
            datavalue: value
          }
        } as S, () => resolve(true));
      }
    }).then(() => {
      if(!this.props.onFieldChange && value !== oldValue){
        this.invokeEventCallback('onChange', [event, this.proxy, value, oldValue]);
      }else if(this.state.props.skipscripteventtrigger && this.props.onFieldChange){
        this.props.onFieldChange('datavalue', value, oldValue, false);
      }
      if (source === 'blur') {
        setTimeout(() => {
          this.invokeEventCallback('onBlur', [event, this.proxy]);
        }, 10);
      }
    })
  }

  onBlur(event: any) {
    Injector.FOCUSED_ELEMENT.remove();
    this.isTouched = true;
    let newVal = this.state.textValue || '';
    let oldVal = this.state.props.datavalue || '';
    this.validate(newVal);
    if (newVal === '' || newVal == undefined) {
      setTimeout(() => {
        this.props.triggerValidation && this.props.triggerValidation();
      },10)
    }
    if (this.state.props.updateon === 'blur' || this.state.props.updateon === 'default') {
      if (oldVal !== newVal && this.state.props.updateon === 'blur') {
        this.updateDatavalue(newVal, event, 'blur');
      } else {
        this.invokeEventCallback('onBlur', [event, this.proxy]);
      }
      this.setState({ isInputFocused: false })
    }
  }

  validate(value: any) {
    const validationObj = validateField(this.state.props, value);
    this.setState({
      isValid: validationObj.isValid,
      errorType: validationObj.errorType
    } as S);
  }

  onFocus(event: any) {
    // When input widgets are inside list widget and try to focus the field, list is selecting but unable to enter values in input fields
    // because on tap event of list is triggering after 200ms timeout So added 250ms timeout here
    setTimeout(() => {
      Injector.FOCUSED_ELEMENT.set(this);
      this.invokeEventCallback('onFocus', [ event, this.proxy]);
      this.closestTappable?.triggerTap();
    }, 250);
    this.setState({ isInputFocused: true })
  }

  onKeyPress(event: any) {
    this.invokeEventCallback('onKeypress', [ event, this.proxy]);
  }
}
