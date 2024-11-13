import React from 'react';
import { View, Text, Platform, DimensionValue } from 'react-native';

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
import { countDecimalDigits, validateInputOnDevice } from '@wavemaker/app-rn-runtime/core/utils';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

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

  public renderTextSkeleton(props:any): React.ReactNode { 
    return this.props.floatinglabel  ?   <>{createSkeleton(this.theme, {} as WmSkeletonStyles, {...props})}</>
    : <>{createSkeleton(this.theme, {} as WmSkeletonStyles, {
      ...this.styles.skeleton.root,
    })}</>
  }

  renderWidget(props: WmCurrencyProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return (<View style={this.styles.root}>
      <View style={{...this._showSkeleton && !this.props.floatinglabel ? this.styles.skeleton.labelWrapper : this.styles.labelWrapper}}>
        {this._showSkeleton ? <>{this.renderTextSkeleton(this.styles.skeleton.text)}</> :
         <Text style={this.styles.label}>{this.state.currencySymbol}</Text>}
      </View>
      {this._showSkeleton ? <>{this.renderTextSkeleton(this.styles.skeleton.animatedView)}</> :<View style={{flex: 1}}>
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
        isInputFocused={ this.state.isInputFocused }
        style={[this.styles.input, this.styles.text, this.state.isValid ? {} : this.styles.invalid, this.state.isInputFocused ? this.styles.focused : {}]}
        {...opts}
        floatingLabel={props.floatinglabel}
        floatingLabelStyle={this.styles.floatingLabel}
        activeFloatingLabelStyle={this.styles.activeFloatingLabel}
        editable={props.disabled || props.readonly ? false : true}
        placeholder={props.placeholder}
        background={this._background}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyPress={this.validateInputEntry.bind(this)}
        onChangeText={(text) => {
          const {isValidText, validText} = validateInputOnDevice(text, "currency");
          const decimalPlaces = props.decimalPlaces;
          const decimalPlacesInNumber = countDecimalDigits(validText);
          const restrictDecimalRegex = new RegExp(`(\\.\\d{${decimalPlaces}})\\d*`);
          const updatedCurrencyText = validText.replace(restrictDecimalRegex, '$1');

          if (!isValidText || decimalPlaces < decimalPlacesInNumber) {
            (this.widgetRef as any)?.setNativeProps({ text: updatedCurrencyText });
          }

          this.onChangeText.bind(this)(updatedCurrencyText, 'currency');
        }}
        onChange={this.invokeChange.bind(this)}
        allowContentSelection={this.styles.text.userSelect === 'text'}
      />
      </View> }
    </View>);
  }
}
