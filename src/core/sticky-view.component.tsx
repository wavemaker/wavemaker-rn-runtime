import React, { 
  ReactNode, 
  useContext, 
  RefObject,
  Dispatch,
  SetStateAction,
 } from "react";
import { ViewStyle, NativeSyntheticEvent, NativeScrollEvent, LayoutRectangle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  runOnJS,
  ReanimatedEvent,
  ScrollEvent,
  AnimatedStyle,
} from "react-native-reanimated";
import { BaseComponent, BaseComponentState, BaseProps, BaseStyles } from "./base.component";
import { SharedValue } from 'react-native-reanimated';
import EventNotifier from "./event-notifier";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { StickyBaseView } from "./components/sticky-base.component";
import { StickyWrapper } from "./sticky-wrapper";

export interface StickyViewComponentsProps {
  stickyNavAnimateStyle?: AnimatedStyle;
  stickyContainerAnimateStyle?: AnimatedStyle;
  children?: ReactNode;
  hasAppnavbar?: boolean;
  onscroll?: string;
  notifier: EventNotifier;
}

// StyickyComponentContext is used for the UI, stickyNav & stickyContainer components will be attached here.
export const StickyComponentsContext = React.createContext<StickyViewComponents>(null as any);

export class StickyViewComponents extends React.Component<StickyViewComponentsProps, any, any> {
  children: Map<StickyBaseView, React.ReactNode> = new Map();
  id = 0;

  add(c: StickyBaseView, n: React.ReactNode) {
    this.children.set(c, n);
    setTimeout(() => this.setState({ id: ++this.id }));
  }

  remove(c: StickyBaseView) {
    this.children.delete(c);
    setTimeout(() => this.setState({ id: ++this.id }));
  }

  render() {
    return (
      <StickyComponentsContext.Provider value={this}>
        <StickyWrapper hasAppnavbar={this.props.hasAppnavbar} onscroll={this.props.onscroll} notifier={this.props.notifier}>
          {(this.props as any).children}
          <Animated.View style={{ position: 'absolute', width: '100%', zIndex: 10 }} pointerEvents={'box-none'}>
            {Array.from(this.children.entries()).map(([view, node]) => {
              const element = node as React.ReactElement;
              return React.cloneElement(element, { 
                key: `sticky-${view.id}`,
                style: element.props.style
              });
            })}
          </Animated.View>
        </StickyWrapper>
      </StickyComponentsContext.Provider>
    );
  }
}