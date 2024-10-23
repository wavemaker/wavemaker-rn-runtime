import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import WmContentProps from './content.props';
import { DEFAULT_CLASS, WmContentStyles } from './content.styles';

export class WmContentState extends BaseComponentState<WmContentProps> {

}

export default class WmContent extends BaseComponent<WmContentProps, WmContentState, WmContentStyles> {

  constructor(props: WmContentProps) {
    super(props, DEFAULT_CLASS, );
  }

  renderWidget(props: WmContentProps) {
    return (
      <SafeAreaInsetsContext.Consumer>
      {(insets = {top: 0, bottom: 0, left: 0, right: 0}) => {  
         const keyboardOffset = insets?.bottom;
          return (
            <View style={this.styles.root}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={keyboardOffset}
                style={{ flex: 1 }}>
                {this._background}
                {props.children}
              </KeyboardAvoidingView>
            </View>
          );
        }}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
