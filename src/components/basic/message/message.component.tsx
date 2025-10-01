import React from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmMessageProps from './message.props';
import { DEFAULT_CLASS, WmMessageStyles } from './message.styles';
import WmIcon from '../icon/icon.component';
import WmButton from '../button/button.component';
import WmAnchor from '../anchor/anchor.component';
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
    return (
    <Animatedview 
      entryanimation={props.animation} 
      delay={props.animationdelay} 
      style={styles.root}
      onLayout={(event: LayoutChangeEvent) => this.handleLayout(event)}
      accessibilityProps={{...getAccessibilityProps(AccessibilityWidgetType.MESSAGE, props)}}
    >
      {this._background}
      <WmIcon
        id={this.getTestId('icon')}
        iconclass={props.messageiconclass || (props.type && MESSAGE_ICONS[props.type])}
        styles={styles.icon}
        accessible={false}></WmIcon>
      <View style={styles.message}>
        <Text {...this.getTestPropsForLabel('title')} style={styles.title} importantForAccessibility='no'>{props.title || DEFAULT_TITLE[props.type || '']}</Text>
        <Text {...this.getTestPropsForLabel('caption')} style={styles.text} importantForAccessibility='no'>{props.caption}</Text>
      </View>
      {props.showanchor ? (
        <WmAnchor
          id={this.getTestId('anchor')}
          caption={props.anchortext}
          hyperlink={props.anchorhyperlink}
          target="_blank"
          styles={styles.closeBtn}
          accessibilitylabel={props.anchortext}
          accessibilityrole='link'></WmAnchor>
      ) : (
        props.hideclose ? null : (
          <WmButton
            id={this.getTestId('close')}
            iconclass={props.closeiconclass || "wi wi-close"}
            styles={styles.closeBtn}
            onTap={this.close}
            accessibilitylabel='close'
            accessibilityrole='button'></WmButton>
        )
      )}
    </Animatedview>);
  }
}
