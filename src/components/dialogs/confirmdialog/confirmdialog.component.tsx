import React from 'react';
import { BaseComponent, BaseComponentState, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';

import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

import WmDialog from '../dialog/dialog.component';
import WmDialogcontent from '../dialogcontent/dialogcontent.component';
import WmDialogactions from '../dialogactions/dialogactions.component';

import WmConfirmdialogProps from './confirmdialog.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmConfirmdialogStyles } from './confirmdialog.styles';
import { merge } from 'lodash-es';

export class WmConfirmdialogState extends BaseComponentState<WmConfirmdialogProps> {}

export default class WmConfirmdialog extends BaseComponent<WmConfirmdialogProps, WmConfirmdialogState, WmConfirmdialogStyles> {

  private dialogRef: WmDialog = null as any;

  private listener: LifecycleListener = {
    onComponentInit: (c) => {
      if (c instanceof WmDialog) {
        this.dialogRef = c;
      }
    }
  };

  constructor(props: WmConfirmdialogProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmConfirmdialogProps());
  }

  open() {
    this.dialogRef.open();
  }

  close() {
    this.dialogRef.close();
  }

  getMessageStyle(type: string) {

  }

  renderWidget(props: WmConfirmdialogProps) {
    return (
      <WmDialog
        iconclass={props.iconclass}
        animation={props.animation}
        closable={props.closable}
        modal={props.modal}
        styles={this.styles.dialog}
        title={props.title}
        listener={this.listener} onOpened={() => {
        this.invokeEventCallback('onOpened', [null, this]);
      }}>
        <WmDialogcontent styles={this.styles.dialogContent}>
          <WmLabel
            caption={props.message || ''}
            styles={this.styles.message}>
          </WmLabel>
        </WmDialogcontent>
        <WmDialogactions styles={this.styles.dialogActions}>
          <WmButton
            caption={props.canceltext}
            styles={deepCopy({}, this.theme.getStyle('btn-default'), this.styles.cancelButton)}
            onTap={() => {
              this.dialogRef.close();
              this.invokeEventCallback('onCancel', [null, this]);
            }}>
          </WmButton>
          <WmButton
            caption={props.oktext}
            styles={deepCopy({}, this.theme.getStyle('btn-default'), this.styles.okButton)}
            onTap={() => {
              this.dialogRef.close();
              this.invokeEventCallback('onOk', [null, this]);
            }}>
          </WmButton>
        </WmDialogactions>
      </WmDialog>
    );
  }
}
