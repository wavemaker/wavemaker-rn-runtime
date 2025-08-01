import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NetworkService, { NetworkState } from '@wavemaker/app-rn-runtime/core/network.service';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { ToastConsumer, ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

import WmNetworkInfoToasterProps from './network-info-toaster.props';
import { DEFAULT_CLASS, WmNetworkInfoToasterStyles } from './network-info-toaster.styles';
import { isEqual } from 'lodash-es';

export class WmNetworkInfoToasterState extends BaseComponentState<WmNetworkInfoToasterProps> {
  newtworkState = {} as NetworkState;
  showToast = false;
}

export default class WmNetworkInfoToaster extends BaseComponent<WmNetworkInfoToasterProps, WmNetworkInfoToasterState, WmNetworkInfoToasterStyles> {
  options = {} as ToastOptions;
  private _close: Function = null as any;

  constructor(props: WmNetworkInfoToasterProps) {
    super(props, DEFAULT_CLASS, new WmNetworkInfoToasterProps(), new WmNetworkInfoToasterState());
    this.updateState({
      newtworkState: NetworkService.getState(),
      showToast: !NetworkService.isConnected()
    } as WmNetworkInfoToasterState);
    this.cleanup.push(
      NetworkService.notifier.subscribe('onNetworkStateChange', (networkState: NetworkState) => {
        if (!isEqual(networkState, this.state.newtworkState)) {
          this.updateState({
            newtworkState: networkState,
            showToast: true
          } as WmNetworkInfoToasterState);
        }
      }
    ));
  }

  getToastContent() {
    if (!this.props.appLocale?.messages) {
      return null;
    }
    if (this.state.newtworkState.isConnected) { 
      return (
      <View style={this.styles.root}>
        {this._background}
        <Text {...this.getTestPropsForLabel('msg')} style={this.styles.text}>{this.props.appLocale.messages.MESSAGE_SERVICE_CONNECTED}</Text>
        <TouchableOpacity {...this.getTestPropsForAction('close')} style={this.styles.action} onPress={() => this._close()}>
          <Text style={this.styles.actionText}>{this.props.appLocale.messages.LABEL_HIDE_NETWORK_INFO}</Text>
        </TouchableOpacity>
      </View>);
    }
    if (this.state.newtworkState.isConnecting) { 
      return (
        <View style={this.styles.root}>
          {this._background}
          <Text {...this.getTestPropsForLabel('msg')} style={this.styles.text}>{this.props.appLocale.messages.MESSAGE_SERVICE_CONNECTING}</Text>
        </View>);
    }
    if (this.state.newtworkState.isServiceAvailable) { 
      return (
      <View style={this.styles.root}>
        {this._background}
        <Text {...this.getTestPropsForLabel('msg')} style={this.styles.text}>{this.props.appLocale.messages.MESSAGE_SERVICE_AVAILABLE}</Text>
        <TouchableOpacity {...this.getTestPropsForAction('close')} style={this.styles.action} onPress={() => this._close()}>
          <Text style={this.styles.actionText}>{this.props.appLocale.messages.LABEL_HIDE_NETWORK_INFO}</Text>
        </TouchableOpacity>
          <Text style={this.styles.actionSeparator}>|</Text>
        <TouchableOpacity {...this.getTestPropsForAction('connect')} style={this.styles.action}>
          <Text style={this.styles.actionText}>{this.props.appLocale.messages.LABEL_CONNECT_TO_SERVICE}</Text>
        </TouchableOpacity>
      </View>);
    }
    if (!this.state.newtworkState.isNetworkAvailable) { 
      return (
      <View style={this.styles.root}>
        {this._background}
        <Text {...this.getTestPropsForLabel('msg')} style={this.styles.text}>{this.props.appLocale.messages.MESSAGE_NETWORK_NOT_AVAILABLE}</Text>
        <TouchableOpacity {...this.getTestPropsForAction('close')} style={this.styles.action} onPress={() => this._close()}>
          <Text style={this.styles.actionText}>{this.props.appLocale.messages.LABEL_HIDE_NETWORK_INFO}</Text>
        </TouchableOpacity>
      </View>);
    }
    return (
      <View style={this.styles.root}>
        {this._background}
        <Text {...this.getTestPropsForLabel('msg')} style={this.styles.text}>{this.props.appLocale.messages.MESSAGE_SERVICE_NOT_AVAILABLE}</Text>
        <TouchableOpacity  {...this.getTestPropsForAction('close')} style={this.styles.action} onPress={() => this._close()}>
          <Text style={this.styles.actionText}>{this.props.appLocale.messages.LABEL_HIDE_NETWORK_INFO}</Text>
        </TouchableOpacity>
      </View>);
  }

  renderWidget(props: WmNetworkInfoToasterProps) {
    this.options.content = this.getToastContent();
    this.options.onClose = () => {
      this._close = null as any;
      this.updateState({
        showToast : false
      } as WmNetworkInfoToasterState);
    };
    return this.options.content && this.state.showToast ? (
      <ToastConsumer>
        {(toastService: ToastService) => {
          this._close = () => toastService.hideToast(this.options);
          toastService.showToast(this.options)
          return null;
        }}
      </ToastConsumer>
    ) : null; 
  }
}
