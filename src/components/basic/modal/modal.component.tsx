import React from 'react';
import { View, Modal as ReactModal } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmModalProps from './modal.props';
import { DEFAULT_CLASS, WmModalStyles } from './modal.styles';

export class WmModalState extends BaseComponentState<WmModalProps> {

}

export default class WmModal extends BaseComponent<WmModalProps, WmModalState, WmModalStyles> {

  constructor(props: WmModalProps) {
    super(props, DEFAULT_CLASS, new WmModalProps());
  }

  renderWidget(props: WmModalProps) {
    return React.createElement(View, {
      style: this.styles.root,
      onLayout: (event) => this.handleLayout(event)
    }, React.createElement(ReactModal, {
      animationType: props.animationType as any,
      transparent: true,
      //@ts-ignore
      style: this.styles.content,
      onLayout: (event) => this.handleLayout(event)
    }, props.children));
  }
}
