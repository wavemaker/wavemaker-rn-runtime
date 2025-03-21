import React from 'react';
import { DimensionValue, LayoutChangeEvent, Platform, View } from 'react-native';
import { isNull } from 'lodash';

import WmNumberProps from './number.props';
import { DEFAULT_CLASS, WmNumberStyles } from './number.styles';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export class WmNumberState extends BaseNumberState<WmNumberProps> {
  keyboardType: any;
}

export default class WmNumber extends BaseNumberComponent<WmNumberProps, WmNumberState, WmNumberStyles> {

  constructor(props: WmNumberProps) {
    super(props, DEFAULT_CLASS, new WmNumberProps(), new WmNumberState());
  }

  public getStyleClassName(): string | undefined {
    const classes = [];
    if (this.state.props.floatinglabel) {
      classes.push('app-number-with-label'); 
    }
    classes.push(super.getStyleClassName());
    return classes.join(' ');
  }

  public renderTextSkeleton(): React.ReactNode { 
    return this.props.floatinglabel  ?   
      <View style={{...this.styles.root}}>{createSkeleton(this.theme, {} as WmSkeletonStyles, {...this.styles.skeletonLabel.root})}</View>
    :<>{createSkeleton(this.theme, {} as WmSkeletonStyles, {
      ...this.styles.skeleton.root,
    })}</> 
  }

  renderWidget(props: WmNumberProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return (this._showSkeleton ? this.renderTextSkeleton() : 
    <WMTextInput
      {...this.getTestPropsForInput()}
      {...getAccessibilityProps(AccessibilityWidgetType.NUMBER, props)}
      ref={(ref: any) => {this.widgetRef = ref;
        // @ts-ignore
        if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
          // @ts-ignore
          ref.selectionStart = ref.selectionEnd = this.cursor;
        }}}
      {...opts}
      floatingLabel={props.floatinglabel}
      floatingLabelStyle={this.styles.floatingLabel}
      activeFloatingLabelStyle={this.styles.activeFloatingLabel}
      isInputFocused={ this.state.isInputFocused }
      style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid, this.state.isInputFocused ? this.styles.focused : {}]}
      keyboardType="numeric"
      background={this._background}
      placeholderTextColor={this.styles.placeholderText.color as any}
      autoFocus={props.autofocus}
      editable={props.disabled || props.readonly ? false : true}
      placeholder={props.placeholder}
      onBlur={(event)=>{this.onBlur.bind(this)(event, !!props.displayValue)}}
      onFocus={this.onFocus.bind(this)}
      onKeyPress={this.validateInputEntry.bind(this)}
      onChangeText={(text) => {
        this.onChangeText.bind(this)(text, 'number', !!props.displayValue);
      }}
      onChange={this.invokeChange.bind(this)}
      allowContentSelection={this.styles.text.userSelect === 'text'}
      customDisplayValue={props.displayValue}
      handleLayout={(event: LayoutChangeEvent) => this.handleLayout(event)}
    />);
  }
}
