import React from 'react';
import { DimensionValue, Platform,Text } from 'react-native';
import WmTextareaProps from './textarea.props';
import { DEFAULT_CLASS, WmTextareaStyles } from './textarea.styles';
import {
  BaseInputComponent,
  BaseInputState
} from '@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import { isNull } from 'lodash';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmTextareaState extends BaseInputState<WmTextareaProps> {}

export default class WmTextarea extends BaseInputComponent<WmTextareaProps, WmTextareaState, WmTextareaStyles> {

  constructor(props: WmTextareaProps) {
    super(props, DEFAULT_CLASS, new WmTextareaProps(), new WmTextareaState());
  }

  public getStyleClassName(): string | undefined {
    const classes = [];
    if (this.state.props.floatinglabel) {
      classes.push('app-textarea-with-label'); 
    }
    classes.push(super.getStyleClassName());
    return classes.join(' ');
  }

  public renderSkeleton(props: WmTextareaProps): React.ReactNode {
    let skeletonWidth, skeletonHeight;
    if(this.props.skeletonwidth == "0") {
      skeletonWidth = 0
    } else {
      skeletonWidth = this.props.skeletonwidth || this.styles.root?.width
    }

    if(this.props.skeletonheight == "0") {
      skeletonHeight = 0
    } else {
      skeletonHeight = this.props.skeletonheight || this.styles.root?.height;
    }

    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: skeletonWidth as DimensionValue,
      height: skeletonHeight as DimensionValue
    });
  }

  renderWidget(props: WmTextareaProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return ( 
      <>
    <WMTextInput
      {...this.getTestPropsForInput()}
      {...getAccessibilityProps(
        AccessibilityWidgetType.TEXTAREA,
        props
      )}
      ref={(ref: any) => {this.widgetRef = ref;
        // @ts-ignore
        if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
          // @ts-ignore
          ref.selectionStart = ref.selectionEnd = this.cursor;
        }}}
      placeholderTextColor={this.styles.placeholderText.color as any}
      isInputFocused={ this.state.isInputFocused }
      style={[this.styles.root, this.styles.text, this.state.isValid ? {} : this.styles.invalid, this.state.isInputFocused ? this.styles.focused : {}]}
      multiline={true}
      numberOfLines={4}
      background={this._background}
      keyboardType={this.state.keyboardType}
      {...opts}
      floatingLabel={props.floatinglabel}
      floatingLabelStyle={this.styles.floatingLabel}
      activeFloatingLabelStyle={this.styles.activeFloatingLabel}
      autoComplete={props.autocomplete ? 'username' : 'off'}
      autoFocus={props.autofocus}
      editable={props.disabled || props.readonly ? false : true}
      maxLength={props.maxchars}
      placeholder={props.placeholder || 'Place your text'}
      onBlur={this.onBlur.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onKeyPress={this.onKeyPress.bind(this)}
      onChangeText={this.onChangeText.bind(this)}
      onChange={this.invokeChange.bind(this)}
      allowContentSelection={this.styles.text.userSelect === 'text'}
      handleLayout={this.handleLayout}
    />
     { (props.maxchars && props.limitdisplaytext) && <Text
        style={[
          this.styles.helpText
        ]} >     
         {props.limitdisplaytext}     
    </Text>}
    </>);
  }
}
