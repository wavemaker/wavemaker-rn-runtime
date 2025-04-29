import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  View,
  Dimensions
} from 'react-native';
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
  translateY: Animated.Value = new Animated.Value(0);
}

export default class WmDialog extends BaseComponent<WmDialogProps, WmDialogState, WmDialogStyles> {
  private _close: Function = () => {};
  private swipeThreshold: number = 100;
  private maxTranslateY: number; // Allow dragging to the bottom of the screen
  private panResponder: any;

  constructor(props: WmDialogProps) {
    super(props, DEFAULT_CLASS, new WmDialogProps(), new WmDialogState());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;

    // Dynamically calculate maxTranslateY as the entire screen height
    const screenHeight = Dimensions.get('window').height;
    this.maxTranslateY = screenHeight;  // Allow drag till bottom of the screen

    this.state.modalOptions.onClose = () => {
      return new Promise<void>((res) => {
        this.updateState({
          props: { show: false }
        } as WmDialogState, () => {
          this.invokeEventCallback('onClose', [null, this]);
          res();
        });
      });
    };

    this.state.modalOptions.onOpen = () => {
      this.invokeEventCallback('onOpened', [null, this]);
    };

    // PanResponder to handle swipe gestures
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 0;
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dy > 0) {
          const dy = Math.min(gestureState.dy, this.maxTranslateY);
          this.state.translateY.setValue(dy);
        }
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const shouldClose =
          gestureState.dy > this.swipeThreshold || gestureState.vy > 1.2;

        if (shouldClose) {
          this.close();
        } else {
          Animated.spring(this.state.translateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
    });
  }

  open() {
    if (!this.state.props.show) {
      this.state.translateY.setValue(0); // Reset position
      this.updateState({
        props: { show: true }
      } as WmDialogState);
    }
  }

  close() {
    Animated.timing(this.state.translateY, {
      toValue: this.maxTranslateY, // Close till bottom of screen
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      this._close(); // Hide after animation
    });
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
              <Animated.View
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
              </Animated.View>
            </ThemeProvider>
          </AssetProvider>
        ), modalService));
        return null;
      }}
    </ModalConsumer>);
  }
}

  
 