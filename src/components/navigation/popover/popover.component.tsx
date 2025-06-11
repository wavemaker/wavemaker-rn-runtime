import React from 'react';
import { isString } from 'lodash-es';
import { LayoutChangeEvent, TouchableOpacity, Text, View, Dimensions, Animated, PanResponder } from 'react-native';
import { BaseComponent, BaseComponentState, BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

import { SyntheticEvent } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';

import WmPopoverProps from './popover.props';
import { DEFAULT_CLASS, WmPopoverStyles } from './popover.styles';
import WmContainer from '../../container/container.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

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
  dragY = new Animated.Value(0);

  constructor(props: WmPopoverProps) {
    super(props, DEFAULT_CLASS, new WmPopoverProps(), new WmPopoverState());

    if (this.state.props.autoopen) {
      this.showPopover(); 
    }
  }

  public panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0 && gestureState.dy < Number(this.styles.popover.minHeight)) {
        this.dragY.setValue(Number(this.styles.popover.minHeight) - gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -50) {
        Animated.timing(this.dragY, {
          toValue: Number(this.styles.popover.maxHeight),
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(this.dragY, {
          toValue: Number(this.styles.popover.minHeight),
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    },
  });
  
  getDefaultStyles() {
    const isActionSheet = this.state.props.type === 'action-sheet';
    return this.theme.getStyle(`${this.defaultClass} ${isActionSheet ? 'app-popover-action-sheet' : ''}`);
  }

  private computePosition = (e: LayoutChangeEvent) => {
    const position = {} as PopoverPosition;
    if (this.state.props.type === 'dropdown') {
      const windowDimensions = Dimensions.get('window');
      this.view.measure((x, y, width, height, px, py) => {
        let popoverwidth = this.state.props.popoverwidth as any;
        if (popoverwidth && isString(popoverwidth)) {
          popoverwidth = parseInt(popoverwidth);
        }
        this.isRTL ? position.right = px : position.left = px
        
        if (px + popoverwidth > windowDimensions.width) {
          this.isRTL
            ? (position.right = px + width - popoverwidth)
            : (position.left = px + width - popoverwidth);
        }
        position.top = py + height;
        this.updateState({position: position} as WmPopoverState);
      });
    }

    this.handleLayout(e)
  };

  public renderPopoverContent (props : WmPopoverProps , styles : WmPopoverStyles, dimensions: any) {
    return (
      <ScrollView style={props.type === "action-sheet" ? {dimensions} : this.theme.mergeStyle(styles.popover, dimensions)} 
      onScroll={(event) => {this.notify('scroll', [event])}}
      scrollEventThrottle={48}
      accessible={props.type !== "dropdown"} accessibilityViewIsModal>
      {props.title ? (<Text style={styles.title}>{props.title}</Text>): null}
      <TouchableOpacity 
      {...this.getTestPropsForAction('outercontent')}
      activeOpacity={1} onPress={() => {
        props.autoclose === 'always' && this.hide()
      }} style={styles.popoverContent.root}>
        <WmContainer
            styles={styles.popoverContent}
            onLoad={() => this.invokeEventCallback('onLoad', [this])}
            {...props.renderPartial ? {
              renderPartial: (p: any, onLoad: Function) => {
                return props.renderPartial && props.renderPartial(props, onLoad);
              }
            } : {}}>
            {props.renderPartial ? null : props.children}
        </WmContainer>
      </TouchableOpacity>
    </ScrollView>
    )}

  public showPopover = (e?: SyntheticEvent) => {
    this.updateState({ isOpened: true } as WmPopoverState);
    this.invokeEventCallback('onShow', [e, this]);
    e?.stopPropagation();
  };

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case "autoopen":
        if($new){
          this.showPopover && this.showPopover()
        }
        else{
          this.hide && this.hide()
      }
    }
  }


  public hide = () => {};

  prepareModalOptions(content: React.ReactNode, styles: WmPopoverStyles, modalService: ModalService) {
    const o = this.state.modalOptions;
    o.modalStyle = styles.modal;
    o.contentStyle = {...styles.modalContent, ...this.state.position};
    o.content = content;
    o.isModal = this.state.props.autoclose !== 'disabled';
    o.centered = true;
    o.animation = this.state.props.contentanimation || 'slideInUp';
    const hideModal = () => {
      if (this.state.isOpened) {
        modalService.hideModal(this.state.modalOptions || o); 
      }
    };
    o.onClose = () => {
      this.hide = () => {};
      this.setState({ isOpened: false, isPartialLoaded: false, modalOptions: {} as ModalOptions });
      this.invokeEventCallback('onHide', [null, this]);
    };
    this.hide = hideModal;
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
      <View style={styles.root} onLayout={this.computePosition} ref={ref => {this.view = ref as View}} {...getAccessibilityProps(AccessibilityWidgetType.POVOVER, props)}>
        {this._background}
        <WmAnchor
          id={this.getTestId('trigger')}
          animation={props.animation}
          caption={props.caption}
          badgevalue={props.badgevalue}
          iconclass={props.iconclass}
          iconposition={props.iconposition}
          iconheight={props.iconheight}
          iconwidth={props.iconwidth}
          iconmargin={props.iconmargin}
          iconurl={props.iconurl}
          styles={styles.link}
          onTap={this.showPopover}/>
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              modalService.showModal(this.prepareModalOptions(props.type === 'action-sheet' ?  (
                <Animated.View style= {[styles.popover,{ height: this.dragY }]} {...this.panResponder.panHandlers}>
                  <GestureHandlerRootView>
                 {this.renderPopoverContent(props, styles, dimensions)}
                 </GestureHandlerRootView>
                  </Animated.View>
              ): (this.renderPopoverContent(props, styles, dimensions)), styles, modalService));
              return null;
            }}
          </ModalConsumer>) : null}
      </View>);
  }
}
