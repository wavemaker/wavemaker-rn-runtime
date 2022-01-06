import React from 'react';
import { View, Text, TextInput } from 'react-native';

import WmCurrencyProps from './currency.props';
import { CURRENCY_INFO } from '@wavemaker/app-rn-runtime/core/currency-constants';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCurrencyStyles } from './currency.styles';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';
import AppI18nService from '@wavemaker/app-rn-runtime/runtime/services/app-i18n.service';
export class WmCurrencyState extends BaseNumberState<WmCurrencyProps> {
  currencySymbol: any;
}

export default class WmCurrency extends BaseNumberComponent<WmCurrencyProps, WmCurrencyState, WmCurrencyStyles> {

  constructor(props: WmCurrencyProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCurrencyProps(), new WmCurrencyState());
    if (!this.state.props.currency) {
      this.state.props.currency = AppI18nService.currencyCode;
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch (name) {
      case 'currency':
        this.updateState({
          currencySymbol: CURRENCY_INFO[$new].symbol,
        } as WmCurrencyState);
        break;

    }
  }

  renderWidget(props: WmCurrencyProps) {
    return (<View style={this.styles.root}>
        <View style={this.styles.labelWrapper}>
          <Text style={this.styles.label}>{this.state.currencySymbol}</Text></View>
        <TextInput ref={ref => this.widgetRef = ref}
        style={[this.styles.input, this.styles.text, this.state.isInvalidNumber ? this.styles.invalid : {}]}
        value={this.state.textValue || ''}
        editable={props.disabled || props.readonly ? false : true}
        placeholder={props.placeholder}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyPress={this.validateInputEntry.bind(this)}
        onChangeText={this.onChangeText.bind(this)}
      />
    </View>);
  }
}
