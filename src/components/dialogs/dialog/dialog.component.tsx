import React from 'react';
import { Text, View } from 'react-native';

import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';

import WmDialogProps from './dialog.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmDialogStyles } from './dialog.styles';

export class WmDialogState extends BaseComponentState<WmDialogProps> {
  modalOptions = {} as ModalOptions;
}

export default class WmDialog extends BaseComponent<WmDialogProps, WmDialogState, WmDialogStyles> {

  private _close: Function = () => {};

  constructor(props: WmDialogProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmDialogProps(), new WmDialogState());
    this.state.modalOptions.onClose = () => {
        return new Promise((resolve) => {
          this.updateState({
            props:{show: false}
          } as WmDialogState, () => {
            this.invokeEventCallback('onClose', [null, this]);
            resolve(0);
          });
        });
      };
  }

  open() {
    if (!this.state.props.show) {
      this.invokeEventCallback('onOpened', [null, this]);
      this.updateState({
        props:{show: true}
      } as WmDialogState);
    }
  }

  close() {
    this._close();
  }

  prepareModalOptions(content: React.ReactNode, modalService: ModalService) {
    const o = this.state.modalOptions;
    o.modalStyle = this.styles.modal;
    o.content = content;
    o.centered = true;
    this._close = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  renderWidget(props: WmDialogProps) {
    return (<ModalConsumer>
      {(modalService: ModalService) => {
        modalService.showModal(this.prepareModalOptions((
          <View style={this.styles.root}>
            <View style={this.styles.header}>
              <View style={this.styles.headerLabel}>
                <WmIcon caption={props.title} iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>
              </View>
              {props.closable && <WmButton show={props.closable} iconclass="fa fa-close" onTap={() => this.close()} styles={this.styles.closeBtn}></WmButton>}
            </View>
            {props.children}
          </View>
        ), modalService));
        return null;
      }}
    </ModalConsumer>); 
  }
}
