import React from 'react';
import { BaseComponent, BaseComponentState, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';

import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

import WmDialog from '../dialog/dialog.component';
import WmDialogcontent from '../dialogcontent/dialogcontent.component';
import WmDialogactions from '../dialogactions/dialogactions.component';

import WmAlertdialogProps from './alertdialog.props';
import { DEFAULT_CLASS, WmAlertdialogStyles } from './alertdialog.styles';

export class WmAlertdialogState extends BaseComponentState<WmAlertdialogProps> {}

const MESSAGE_STYLES = new Map<string, string>([
  ['error', 'text-danger'],
  ['information', 'text-info'],
  ['warning', 'text-warning'],
  ['success', 'text-success']
]);

export default class WmAlertdialog extends BaseComponent<WmAlertdialogProps, WmAlertdialogState, WmAlertdialogStyles> {

  private dialogRef: WmDialog = null as any;

  private listener: LifecycleListener = {
    onComponentInit: (c) => {
      if (c instanceof WmDialog) {
        this.dialogRef = c;
      }
    }
  };

  constructor(props: WmAlertdialogProps) {
    super(props, DEFAULT_CLASS, new WmAlertdialogProps());
  }

  open() {
    this.dialogRef.open();
  }

  close() {
    this.dialogRef.close();
  }

  getMessageStyle(type: string) {

  }

  renderWidget(props: WmAlertdialogProps) {
    const messageStyle = this.theme.getStyle(MESSAGE_STYLES.get(props.alerttype || 'error') as string);
    return (
      <WmDialog
        id={this.getTestId('dialog')}
        iconclass={props.iconclass}
        iconurl={props.iconurl}
        iconheight={props.iconheight}
        iconmargin={props.iconmargin}
        iconwidth={props.iconwidth}
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
            id={this.getTestId('msg')}
            caption={props.message || ''}
            styles={this.styles.message}></WmLabel>
        </WmDialogcontent>
        <WmDialogactions styles={this.styles.dialogActions}>
          <WmButton
            id={this.getTestId('okbtn')}
            caption={props.oktext}
            styles={this.theme.mergeStyle({},this.styles.okButton,this.theme.getStyle('btn-only-label'))}
            onTap={() => {
              this.dialogRef.close();
              this.invokeEventCallback('onOk', [null, this]);
            }}></WmButton>
        </WmDialogactions>
      </WmDialog>
    );
  }
}
