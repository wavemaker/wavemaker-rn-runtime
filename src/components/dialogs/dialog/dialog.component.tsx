import React from 'react';
import { Text, View } from 'react-native';

import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';

import WmDialogProps from './dialog.props';
import { DEFAULT_CLASS, WmDialogStyles } from './dialog.styles';

export class WmDialogState extends BaseComponentState<WmDialogProps> {
  modalOptions = {} as ModalOptions;
}

export default class WmDialog extends BaseComponent<WmDialogProps, WmDialogState, WmDialogStyles> {

  private _close: Function = () => {};

  constructor(props: WmDialogProps) {
    super(props, DEFAULT_CLASS, new WmDialogProps(), new WmDialogState());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
    this.state.modalOptions.onClose = () => {
      return new Promise<void>((res) => {
        this.updateState({
          props: {show: false}
        } as WmDialogState, () => {
          this.invokeEventCallback('onClose', [null, this]);
          res();
        });
      });
    };
    this.state.modalOptions.onOpen = () => {
      this.invokeEventCallback('onOpened', [null, this]);
    };
  }

  open() {
    if (!this.state.props.show) {
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
    o.name = this.state.props.name;
    o.modalStyle = this.styles.modal;
    o.content = content;
    o.contentStyle = this.styles.content;
    o.isModal = !!this.state.props.modal;
    o.centered = true;
    o.animation = this.state.props.animation;
    o.animationdelay = this.state.props.animationdelay || 0;
    this._close = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  renderWidget(props: WmDialogProps) {
    return (<ModalConsumer>
      {(modalService: ModalService) => {
        modalService.showModal(this.prepareModalOptions((
          <AssetProvider value={this.loadAsset}>
            <ThemeProvider value={this.theme}>
              <View style={this.styles.root} testID="wm-dialog">
              {this._background}
                {props.showheader ? (<View style={this.styles.header} testID="wm-dialog-header">
                  <View style={this.styles.headerLabel}>
                  {props.iconclass || props.iconurl || props.title ?
                    <WmIcon id={this.getTestId('icon')}
                     caption={props.title}
                     accessibilityrole='header'
                     iconclass={props.iconclass}
                     styles={this.styles.icon}
                     iconurl={props.iconurl}
                     iconheight={props.iconheight}
                     iconmargin={props.iconmargin}
                     iconwidth={props.iconwidth}
                     /> : null}
                  </View>
                  {props.closable && <WmButton id={this.getTestId('closebtn')} show={props.closable} iconclass="wm-sl-l sl-close" onTap={() => this.close()} styles={this.styles.closeBtn}></WmButton>}
                </View>) : null}
                {props.children}
              </View>
            </ThemeProvider>
          </AssetProvider>
        ), modalService));
        return null;
      }}
    </ModalConsumer>);
  }
}
