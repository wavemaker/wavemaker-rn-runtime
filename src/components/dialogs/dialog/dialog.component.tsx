import React from 'react';
import { Text, View, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
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
  translateY: number = 0;
}

export default class WmDialog extends BaseComponent<WmDialogProps, WmDialogState, WmDialogStyles> {
  private _close: Function = () => {};
  private swipeThreshold: number = 100; // Minimum distance to swipe down to close
  private panResponder: any;

  constructor(props: WmDialogProps) {
    super(props, DEFAULT_CLASS, new WmDialogProps(), new WmDialogState());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
    
    this.state.modalOptions.onClose = () => {
      return new Promise<void>((res) => {
        this.updateState({
          props: {show: false},
          translateY: 0
        } as WmDialogState, () => {
          this.invokeEventCallback('onClose', [null, this]);
          res();
        });
      });
    };
    
    this.state.modalOptions.onOpen = () => {
      this.invokeEventCallback('onOpened', [null, this]);
    };

    // Initialize PanResponder for swipe gestures
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 0;
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          this.updateState({
            translateY: gestureState.dy
          } as WmDialogState);
        }
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dy > this.swipeThreshold) {
          // Close the dialog if swipe distance exceeds threshold
          this.close();
        } else {
          // Reset position if threshold not met
          this.updateState({
            translateY: 0
          } as WmDialogState);
        }
      }
    });
  }

  open() {
    if (!this.state.props.show) {
      this.updateState({
        props: {show: true},
        translateY: 0
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
              <View
                {...this.panResponder.panHandlers}
                style={[
                  this.styles.root,
                  {transform: [{ translateY: this.state.translateY }]}
                ]}
                testID="wm-dialog"
                onLayout={(event) => this.handleLayout(event)}
              >
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