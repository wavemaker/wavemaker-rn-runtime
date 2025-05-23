import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLoginProps from './login.props';
import { DEFAULT_CLASS, WmLoginStyles } from './login.styles';
import { AxiosError, AxiosResponse } from 'axios';

export class WmLoginState extends BaseComponentState<WmLoginProps> {
  errorMsg = '';
}

export default class WmLogin extends BaseComponent<WmLoginProps, WmLoginState, WmLoginStyles> {
  constructor(props: WmLoginProps) {
    super(props, DEFAULT_CLASS, new WmLoginProps());
  }

  onLoginSuccess(response: AxiosResponse) {
  }

  onLoginError(error: AxiosError) {
    this.updateState({errorMsg: error?.message} as WmLoginState);
  }

  doLogin(formData: any) {
    this.props.onLogin(formData, this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
  }

  renderWidget(props: WmLoginProps) {
    return (
    <View 
      style={this.styles.root}
      onLayout={(event) => this.handleLayout(event)}
    >
      {this._background}
      {(this.state.errorMsg && props.showerror) && <Text {...this.getTestPropsForLabel('error')} style={this.styles.errorMsgStyles}>{this.state.errorMsg}</Text>}
      <View style={this.styles.formStyles}>{props.children}</View>
    </View>); 
  }
}
