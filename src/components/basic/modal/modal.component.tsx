import React from 'react';
import { View, Modal as ReactModal } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmModalProps from './modal.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './modal.styles';

export default class WmModal extends BaseComponent<WmModalProps, BaseComponentState<WmModalProps>> {

  constructor(props: WmModalProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmModalProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return React.createElement(View, {
      style: this.styles.root
    }, React.createElement(ReactModal, {
      animationType: props.animationType as any,
      transparent: true,
      //@ts-ignore
      style: this.styles.content
    }, props.children));
  }
}
