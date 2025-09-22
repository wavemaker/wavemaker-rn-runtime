import React, { RefObject } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated, { AnimatedStyle, ReanimatedEvent, runOnJS, ScrollEvent, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { StickyViewComponentsProps } from "./sticky-view.component";
import injector from "./injector";
import AppConfig from "./AppConfig";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// StickyWrapperContext is used for the usage & passing of hooks in StickyWrapper(functional component) to childrens.
export const StickyWrapperContext = React.createContext<StickyWrapperContextType | undefined>(undefined);

export type CustomJsScrollEvent = {
  contentOffset: { y: number };
  contentSize: { height: number};
  layoutMeasurement: { height: number};
  scrollDirection: number;
  scrollDelta: number;
};


export type StickyWrapperContextType = {
  stickyNavTranslateY?: SharedValue<number>;
  stickyContainerTranslateY: SharedValue<number>;

  stickyNavAnimateStyle: AnimatedStyle;
  stickyContainerAnimateStyle: AnimatedStyle;

  navHeight: SharedValue<number>;
  bottomTabHeight: SharedValue<number>;
  scrollDirection: SharedValue<number>;

  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (scrollRef: RefObject<Animated.ScrollView>) => void;
};

export const StickyWrapper = ({ children, hasAppnavbar, onscroll, notifier }: StickyViewComponentsProps) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const scrollY = useSharedValue<number>(0);
  const prevScrollY = useSharedValue<number>(0);
  const scrollVelocity = useSharedValue<number>(0);
  const scrollDirection = useSharedValue<number>(0);

  const stickyContainerTranslateY = useSharedValue<number>(0);
  const stickyNavTranslateY = useSharedValue<number>(0);

  // Default navbar height from appnavbar styles is 80, maintaining this to minimize the navHeight immediate flicker (in page-content paddingTop)
  const insets = useSafeAreaInsets();
  const insetsVal = appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp ? insets?.top : 0;
  const navHeight = useSharedValue<number>(hasAppnavbar && (onscroll == 'topnav' || onscroll == 'topnav-bottomnav') ? (80 + insetsVal) : 0);
  const bottomTabHeight = useSharedValue<number>(0);

  const lastNotifyTime = useSharedValue<number>(0);
  const prevScrollTime = useSharedValue<number>(0);

  const stickyNavAnimateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -stickyNavTranslateY.value }]
    };
  }, [stickyNavTranslateY]);

  const stickyContainerAnimateStyle = useAnimatedStyle(() => {
    const stickyNav = onscroll == 'topnav' ||  onscroll == 'topnav-bottomnav';
    if(stickyNav){
      return {
        transform: [{ translateY: 
          Math.max(
            Math.max(stickyContainerTranslateY.value - navHeight.value - scrollY.value, - navHeight.value),  
            - stickyNavTranslateY.value
          )
        }],
      }
    }else{
      return {
        transform: [{ translateY: Math.max(stickyContainerTranslateY.value - scrollY.value, navHeight.value)}]
      }
    }
  }, [scrollY, stickyContainerTranslateY, navHeight, stickyNavTranslateY]);

  const notifyEvent = (event: CustomJsScrollEvent)=>{
    if(notifier) {
      notifier.notify('scroll', [{nativeEvent: event}]);
    }
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event: ReanimatedEvent<ScrollEvent>): void => {
      const y = event.contentOffset?.y;
      const currentScrollTime = Date.now();

      const delta = y - prevScrollY.value;
      const delaTime = currentScrollTime - prevScrollTime.value;
      if(delta != 0) scrollDirection.value = delta > 0 ? -1 : 1;

      if (Math.abs(delta) >= 0.1){
        prevScrollY.value = y;
        scrollY.value = Math.max(0, y);

        stickyNavTranslateY.value = Math.max(Math.min(stickyNavTranslateY.value + delta, navHeight.value), 0);

        scrollVelocity.value = Math.abs(delta) / delaTime;
        prevScrollTime.value = currentScrollTime;
      }

      if(currentScrollTime - lastNotifyTime.value >= 100){
        lastNotifyTime.value = currentScrollTime;
        const safeEvent = {
          contentOffset: {
            y: event.contentOffset?.y ?? 0,
          },
          contentSize: {
            height: event.contentSize?.height ?? 0,
          },
          layoutMeasurement: {
            height: event.layoutMeasurement?.height ?? 0,
          },
          scrollDirection: scrollDirection.value,
          scrollDelta: delta,
        };
        runOnJS(notifyEvent)(safeEvent);
      }
    }
  });

  const onScrollEndDrag = (scrollRef: RefObject<Animated.ScrollView>): void =>{
    const y = scrollY.value;
    if(scrollVelocity.value < 0.3){
      if(scrollDirection.value < 0 && stickyNavTranslateY.value >= (navHeight.value / 9.9)){ // bottom visible
        scrollRef?.current?.scrollTo({ y: y + (navHeight.value - stickyNavTranslateY.value), animated: true })
      } else if( scrollDirection.value > 0 &&  stickyNavTranslateY.value <= (navHeight.value / 1.1)) { // top content visible
        scrollRef?.current?.scrollTo({ y: y - stickyNavTranslateY.value, animated: true })
      }
    }
  }

  const contextValue = {
    scrollDirection,
    stickyNavAnimateStyle,
    stickyContainerAnimateStyle,
    stickyContainerTranslateY,
    navHeight,
    bottomTabHeight, 
    onScroll,
    onScrollEndDrag
  };

  return (
    <StickyWrapperContext.Provider value={contextValue}>
      {children}
    </StickyWrapperContext.Provider>
  );
};