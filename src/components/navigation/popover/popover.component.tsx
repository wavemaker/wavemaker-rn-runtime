import React from 'react';
import { LayoutChangeEvent, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { BaseComponent, BaseComponentState, BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

import { TapEvent } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';

import WmPopoverProps from './popover.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPopoverStyles } from './popover.styles';
import WmContainer from '../../container/container.component';

export class WmPopoverState extends BaseComponentState<WmPopoverProps> {
  isOpened: boolean = false;
  modalOptions = {} as ModalOptions;
  position = {} as PopoverPosition;
  isPartialLoaded = false;
}

export interface PopoverPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export default class WmPopover extends BaseComponent<WmPopoverProps, WmPopoverState, WmPopoverStyles> {

  view: View = null as any;

  constructor(props: WmPopoverProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPopoverProps(), new WmPopoverState());
  }

  private computePosition = (e: LayoutChangeEvent) => {
    const position = {} as PopoverPosition;
    if (this.state.props.type === 'dropdown') {
      this.view.measure((x, y, width, height, px, py) => {
        position.left = px + width - (this.state.props.popoverwidth as number || 0);
        position.top = py + height;
        this.updateState({position: position} as WmPopoverState);
      });
    }
  };

  public showPopover = (e?: TapEvent) => {
    this.setState({ isOpened: true });
    this.invokeEventCallback('onShow', [e, this]);
    e?.stopPropagation();
  };

  public hide = () => {};

  prepareModalOptions(content: React.ReactNode, styles: WmPopoverStyles, modalService: ModalService) {
    const o = this.state.modalOptions;
    o.modalStyle = styles.modal;
    o.contentStyle = {...styles.modalContent, ...this.state.position};
    o.content = content;
    o.isModal = this.state.props.autoclose !== 'disabled';
    o.centered = true;
    o.animation = this.state.props.contentanimation || 'slideInUp';
    o.onClose = () => {
      this.hide = () => {};
      this.setState({ isOpened: false, isPartialLoaded: false, modalOptions: {} as ModalOptions });
      this.invokeEventCallback('onHide', [null, this]);
    };
    this.hide = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  renderWidget(props: WmPopoverProps) {
    let dimensions = {} as any;
    const styles = this.theme.mergeStyle(this.theme.getStyle('popover-' + props.type), this.styles);
    if (props.type === 'dropdown') {
      if (props.popoverwidth) {
        dimensions.width = props.popoverwidth;
        styles.modalContent.width = props.popoverwidth;
      }
      if (props.popoverheight) {
        dimensions.height = props.popoverheight;
      }
    }
    return (
      <View style={styles.root} onLayout={this.computePosition} ref={ref => {this.view = ref as View}}>
        <WmAnchor
          animation={props.animation}
          caption={props.caption}
          badgevalue={props.badgevalue}
          iconclass={props.iconclass}
          iconposition={props.iconposition}
          styles={styles.link}
          onTap={this.showPopover}></WmAnchor>
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              modalService.showModal(this.prepareModalOptions((
                  <ScrollView style={this.theme.mergeStyle(styles.popover, dimensions)}>
                    {props.title ? (<Text style={styles.title}>{props.title}</Text>): null}
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                      props.autoclose === 'always' && this.hide()
                    }} style={styles.popoverContent.root}>
                      <WmContainer
                        styles={styles.popoverContent}
                        onLoad={() => this.invokeEventCallback('onLoad', [this])}
                        renderPartial={props.renderPartial}>
                          {props.renderPartial ? null : props.children}
                      </WmContainer>
                    </TouchableOpacity>
                  </ScrollView>
              ), styles, modalService));
              return null;
            }}
          </ModalConsumer>) : null}
      </View>);
  }
}
