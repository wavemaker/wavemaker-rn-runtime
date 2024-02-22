import React from 'react';
import { View, Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmMessageProps from './message.props';
import { DEFAULT_CLASS, WmMessageStyles } from './message.styles';
import WmIcon from '../icon/icon.component';
import WmButton from '../button/button.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

export class WmMessageState extends BaseComponentState<WmMessageProps> {}

const MESSAGE_ICONS = {
  'success': 'wm-sl-l sl-check',
  'warning': 'wm-sl-l sl-alarm-bell',
  'error': 'fa fa-times-circle',
  'info': 'wi wi-info',
  'loading': 'fa fa-spinner fa-spin'
};

const DEFAULT_TITLE = {
  'success': 'Success',
  'warning': 'Warning',
  'error': 'Error',
  'info': 'Info',
  'loading': 'Processing'
} as any;

export default class WmMessage extends BaseComponent<WmMessageProps, WmMessageState, WmMessageStyles> {

  constructor(props: WmMessageProps) {
    super(props, DEFAULT_CLASS, new WmMessageProps());
  }

  showMessage() {
    this.updateState({
      props: {
        show: true
      }
    } as WmMessageState);
  }

  hideMessage() {
    this.updateState({
      props: {
        show: false
      }
    } as WmMessageState);
  }

  close = () => {
    this.updateState({props: {
      show : false
    }}, () => this.invokeEventCallback('onClose', [null, this]));
  }

  renderWidget(props: WmMessageProps) {
    const styles = this.theme.mergeStyle(this.theme.getStyle(`${props.type}-${props.variant}-message`), this.styles);
    return (<Animatedview entryanimation={props.animation} style={styles.root}>
      {this._background}
      <WmIcon
        id={this.getTestId('icon')}
        iconclass={props.type && MESSAGE_ICONS[props.type]}
        styles={styles.icon}></WmIcon>
      <View style={styles.message}>
        <Text {...this.getTestPropsForLabel('title')} style={styles.title} {...getAccessibilityProps(AccessibilityWidgetType.MESSAGE, props)}>{props.title || DEFAULT_TITLE[props.type || '']}</Text>
        <Text {...this.getTestPropsForLabel('caption')} style={styles.text} {...getAccessibilityProps(AccessibilityWidgetType.MESSAGE, props)}>{props.caption}</Text>
      </View>
      {props.hideclose ? null : (
        <WmButton
          id={this.getTestId('close')}
          iconclass="wi wi-close"
          styles={styles.closeBtn}
          onTap={this.close}></WmButton>
      )}
    </Animatedview>);
  }
}
