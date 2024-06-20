import React from 'react';
import { View, Text, Platform } from 'react-native';

import WmCurrencyProps from './currency.props';
import { CURRENCY_INFO } from '@wavemaker/app-rn-runtime/core/currency-constants';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import { DEFAULT_CLASS, WmCurrencyStyles } from './currency.styles';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';
import { isNull } from "lodash";
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
export class WmCurrencyState extends BaseNumberState<WmCurrencyProps> {
  currencySymbol: any;
}

export default class WmCurrency extends BaseNumberComponent<WmCurrencyProps, WmCurrencyState, WmCurrencyStyles> {

  constructor(props: WmCurrencyProps) {
    super(props, DEFAULT_CLASS, new WmCurrencyProps(), new WmCurrencyState());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch (name) {
      case 'currency':
        if ($new) {
          this.updateState({
            currencySymbol: CURRENCY_INFO[$new].symbol,
          } as WmCurrencyState);
        }
        break;

    }
  }

  public getStyleClassName(): string | undefined {
    const classes = [];
    if (this.state.props.floatinglabel) {
      classes.push('app-currency-with-label'); 
    }
    classes.push(super.getStyleClassName());
    return classes.join(' ');
  }

  renderWidget(props: WmCurrencyProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return (<View style={this.styles.root}>
      <View style={this.styles.labelWrapper}>
        <Text style={this.styles.label}>{this.state.currencySymbol}</Text>
      </View>
      <View style={{flex: 1}}>
      <WMTextInput
        {...this.getTestPropsForInput()}
        {...getAccessibilityProps(AccessibilityWidgetType.CURRENCY, props)}
        ref={(ref: any) => {
          this.widgetRef = ref;
          // @ts-ignore
          if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
            // @ts-ignore
            ref.selectionStart = ref.selectionEnd = this.cursor;
          }
        }}
        keyboardType="numeric"
        placeholderTextColor={this.styles.placeholderText.color as any}
        style={[this.styles.input, this.styles.text, this.state.isValid ? {} : this.styles.invalid]}
        {...opts}
        floatingLabel={props.floatinglabel}
        floatingLabelStyle={this.styles.floatingLabel}
        activeFloatingLabelStyle={this.styles.activeFloatingLabel}
        editable={props.disabled || props.readonly ? false : true}
        placeholder={props.placeholder}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyPress={this.validateInputEntry.bind(this)}
        onChangeText={(text) => {
          this.onChangeText.bind(this)(text, 'currency');
        }}
        onChange={this.invokeChange.bind(this)}
        allowContentSelection={this.styles.text.userSelect === 'text'}
      />
      </View>
    </View>);
  }
}
