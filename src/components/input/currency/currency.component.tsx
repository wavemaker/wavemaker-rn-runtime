import React from 'react';
import { Text, TextInput } from 'react-native';

import WmCurrencyProps from './currency.props';
import { CURRENCY_INFO } from '@wavemaker/app-rn-runtime/core/currency-constants';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCurrencyStyles } from './currency.styles';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';
export class WmCurrencyState extends BaseNumberState<WmCurrencyProps> {
  currencySymbol: any;
}

export default class WmCurrency extends BaseNumberComponent<WmCurrencyProps, WmCurrencyState, WmCurrencyStyles> {

  constructor(props: WmCurrencyProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCurrencyProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'currency':
        this.updateState({
          currencySymbol: CURRENCY_INFO[$new || 'USD'].symbol,
        } as WmCurrencyState);
        break;

    }
  }

  renderWidget(props: WmCurrencyProps) {
    return (<Text>
        <Text>{this.state.currencySymbol}</Text>
        <TextInput
        style={[this.styles.root, {borderBottomWidth: this.state.isInvalidNumber ? 1 : 0, borderBottomColor: this.state.isInvalidNumber ? 'red' : 'green'}]}
        defaultValue={props.datavalue}
        editable={props.disabled || props.readonly ? false : true}
        placeholder={props.placeholder}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyPress={this.validateInputEntry.bind(this)}
        onChange={this.onChange.bind(this)}
      />
    </Text>);
  }
}
