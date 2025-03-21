import React from 'react';
import { DimensionValue, Platform } from 'react-native';

import WmTextProps from './text.props';
import { DEFAULT_CLASS, WmTextStyles } from './text.styles';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import { BaseInputComponent, BaseInputState } from "@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component";
import { isNull } from 'lodash';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmTextState extends BaseInputState<WmTextProps> {
}

export default class WmText extends BaseInputComponent<WmTextProps, WmTextState, WmTextStyles> {

  constructor(props: WmTextProps) {
    super(props, DEFAULT_CLASS, new WmTextProps(), new WmTextState());
  }

  public getStyleClassName(): string | undefined {
    const classes = [];
    if (this.state.props.floatinglabel) {
      classes.push('app-text-with-label'); 
    }
    classes.push(super.getStyleClassName());
    return classes.join(' ');
  }

  public renderSkeleton(props: WmTextProps): React.ReactNode { 
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
    })
  }

  renderWidget(props: WmTextProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return (
        <WMTextInput
          {...this.getTestPropsForInput()}
          {...getAccessibilityProps(
            AccessibilityWidgetType.TEXT,
            props
          )}
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
          placeholderTextColor={this.styles.placeholderText.color as any}
          isInputFocused={ this.state.isInputFocused }
          style={[this.styles.root, this.styles.text, this.state.isValid ? {} : this.styles.invalid, this.state.isInputFocused ? this.styles.focused : {}]}
          keyboardType={this.state.keyboardType}
          autoComplete={props.autocomplete === "true" ? "username" : props.autocomplete === "false" ? "off" : props.autocomplete}
          autoFocus={props.autofocus}
          editable={props.disabled || props.readonly ? false : true}
          secureTextEntry={props.type === 'password' && !props.maskchar ? true : false}
          displayformat={props.displayformat}
          background={this._background}
          maskchar={props.maskchar}
          maxLength={props.maxchars}
          placeholder={props.placeholder}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
          onChangeText={this.onChangeText.bind(this)}
          onChange={this.invokeChange.bind(this)}
          allowContentSelection={this.styles.text.userSelect === 'text'}
          autoCapitalize={props.autocapitalize}
          handleLayout={this.handleLayout}
        />
    );
  }
}
