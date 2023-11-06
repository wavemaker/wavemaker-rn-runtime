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

  renderWidget(props: WmCurrencyProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return (<View style={this.styles.root}>
        <View style={this.styles.labelWrapper}>
          <Text style={this.styles.label}>{this.state.currencySymbol}</Text></View>
        <WMTextInput
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
          editable={props.disabled || props.readonly ? false : true}
          placeholder={props.placeholder}
          value={this.state.textValue}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onKeyPress={this.validateInputEntry.bind(this)}
          onChangeText={(text) => {
            this.onChangeText.bind(this)(text, 'currency');
          }}
          onChange={this.invokeChange.bind(this)}
          allowContentSelection={this.styles.text.userSelect === 'text'}
        />
      </View>);
  }
}
