import React, { createRef } from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { View, PanResponder, Dimensions, TouchableWithoutFeedback, Platform, PanResponderGestureState, StatusBar, BackHandler, DimensionValue, KeyboardAvoidingView, Keyboard, EmitterSubscription, Modal, NativeEventSubscription, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
  SharedValue,
  makeMutable,
  cancelAnimation
} from 'react-native-reanimated';
import WmBottomsheetProps from './bottomsheet.props';
import { DEFAULT_CLASS, WmBottomsheetStyles } from './bottomsheet.styles';
import { createSkeleton } from '../skeleton/skeleton.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { ModalProvider, ModalService, ModalOptions } from '@wavemaker/app-rn-runtime/core/modal.service';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');
export class WmBottomsheetState extends BaseComponentState<WmBottomsheetProps> {
  scrollViewRef = createRef<ScrollView>();
  isScrolling = false;
  scrollOffset = 0;
  isExpanded = false;
  isBottomsheetVisible = false;
  keyboardHeight = 0;
  localModalsOpened: ModalOptions[] = [];
  lastGestureDy = 0;
}

// Animated wrapper component that uses hooks
const AnimatedBottomsheetContent = ({
  translateY,
  backdropOpacity,
  sheetHeight,
  lastGestureDy,
  styles,
  props,
  children,
  panHandlers,
  dragHandlePanHandlers,
  onBackdropPress,
  onDragHandlePress,
  getTestProps,
  enabledragsettle
}: any) => {
  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
    transform: [{ translateY: translateY.value }]
  }));

  const contentStyle = useAnimatedStyle(() => {
    if (enabledragsettle && lastGestureDy.value > 0) {
      return {
        paddingBottom: lastGestureDy.value
      };
    }
    return {};
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={onBackdropPress}>
        <Animated.View
          style={[styles.backdrop, backdropAnimatedStyle]}
          {...getTestProps('backdrop')}
          {...getAccessibilityProps(AccessibilityWidgetType.BOTTOMSHEET, props)}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.container, containerAnimatedStyle]}
        {...panHandlers}
      >
        <View style={styles.dragHandleContainer} {...dragHandlePanHandlers}>
          <Pressable onPress={onDragHandlePress}>
            <View style={styles.dragIconHandle} {...getTestProps('draghandle')} />
          </Pressable>
        </View>
        {children(contentStyle)}
      </Animated.View>
    </>
  );
};

export default class WmBottomsheet extends BaseComponent<WmBottomsheetProps, WmBottomsheetState, WmBottomsheetStyles> {
  private calculatedHeight: number;
  private expandedHeight: number;
  private defaultHeight: number = 0.5;
  private expandedDefaultHeight: number = 0.8;
  private minimumHeight: number = 0.01;
  private minimumExpandedHeight: number = 0.5;
  private maxHeight: number = 1.0;
  private animationDuration: number = 400;
  private keyboardAnimationDuration: number = Platform.OS === 'ios' ? 250 : 275;
  private statusBarHeight: number = StatusBar.currentHeight || 0;
  private defaultTopInset: number = 44;
  private maxHeightRatio: number = 0;
  private keyboardDidShowListener!: EmitterSubscription;
  private keyboardDidHideListener!: EmitterSubscription;
  private topInset: number = 0;
  private iosKeyboardHeight: number = 0;
  private isIosKeyboardHeightSet: boolean = false;
  private sheetModalService: ModalService;
  private isDragHandleExpanding: boolean = false;

  // Reanimated shared values - created once and reused
  private translateY!: SharedValue<number>;
  private backdropOpacity!: SharedValue<number>;
  private sheetHeight!: SharedValue<number>;
  private lastGestureDyShared!: SharedValue<number>;

  // Helper method to calculate animation duration based on distance and velocity
  private getAnimationDuration(distance: number, velocity: number): number {
    // Base duration on distance, but cap it between 200-500ms
    // Higher velocity = shorter duration for snappier feel
    const velocityFactor = Math.max(0.3, Math.min(1, 1 - Math.abs(velocity) / 2));
    const calculatedDuration = Math.abs(distance) * velocityFactor;
    return Math.min(500, Math.max(200, calculatedDuration));
  }

  private calculateSheetHeight(bottomsheetheightratio: number): number {
    // Use default height if ratio not provided, but ensure it's not below minimum
    const effectiveRatio = bottomsheetheightratio || this.defaultHeight;
    this.maxHeightRatio = Math.max(
      this.minimumHeight,
      Math.min(effectiveRatio, this.maxHeight)
    );

    const screenHeight = Dimensions.get('screen').height;
    let calculatedHeight = screenHeight * this.maxHeightRatio;

    if (Platform.OS === 'ios') {
      // Subtract top inset bar height for ios only if bottomsheetheightratio is 0.9
      if (this.maxHeightRatio >= 0.9) {
        calculatedHeight -= this.defaultTopInset;
      }
    }
    else if (Platform.OS === 'android') {
      // Subtract status bar height for Android only if bottomsheetheightratio is 0.9
      if (this.maxHeightRatio >= 0.9) {
        calculatedHeight -= this.statusBarHeight;
      }
    }
    return calculatedHeight;
  }

  open() {
    if (!this.state.isBottomsheetVisible)
      this.updateState({
        isBottomsheetVisible: true
      } as WmBottomsheetState);
    this.openSheet();
  }

  close() {
    if (this.state.isBottomsheetVisible) {
      this.closeSheet();
    }
  }

  isSheetExpanded = () => {
    return this.state.isExpanded
  }

  expandBottomSheet = () => {
    const targetHeight = Math.min(this.expandedHeight, SCREEN_HEIGHT);
    const callback = () => {
      this.updateState({
        isExpanded: true,
        lastGestureDy: 0
      } as WmBottomsheetState);
      this.invokeEventCallback('onExpand', [null, this]);
    };

    // Reset drag settle value immediately on UI thread
    this.lastGestureDyShared.value = 0;

    if (this.props.enabledragsettle) {
      // Synchronize both animations to complete together
      this.sheetHeight.value = withTiming(targetHeight, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      });
      this.translateY.value = withTiming(0, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      }, (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      });
    } else {
      // Only animate height for non-drag-settle mode
      this.sheetHeight.value = withTiming(targetHeight, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      }, (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      });
    }
  }

  collapseBottomSheet = () => {
    const callback = () => {
      this.updateState({
        isExpanded: false,
        lastGestureDy: 0
      } as WmBottomsheetState);
      this.invokeEventCallback('onCollapse', [null, this]);
    };

    // Reset drag settle value immediately on UI thread
    this.lastGestureDyShared.value = 0;

    this.translateY.value = withTiming(0, {
      duration: this.animationDuration,
      easing: Easing.out(Easing.ease)
    });
    this.sheetHeight.value = withTiming(this.calculatedHeight, {
      duration: this.animationDuration,
      easing: Easing.out(Easing.ease)
    }, (finished) => {
      if (finished) {
        runOnJS(callback)();
      }
    });
  }

  constructor(props: WmBottomsheetProps) {
    super(props, DEFAULT_CLASS, new WmBottomsheetProps(), new WmBottomsheetState());
    this.calculatedHeight = this.calculateSheetHeight(props.bottomsheetheightratio);

    // Use bottomsheetexpandedheightratio if provided, otherwise use expandedDefaultHeight
    const expandedRatio = props.bottomsheetexpandedheightratio || this.expandedDefaultHeight;
    const effectiveExpandedRatio = Math.max(
      this.minimumExpandedHeight,
      Math.min(expandedRatio, this.maxHeight)
    );

    this.expandedHeight = SCREEN_HEIGHT * effectiveExpandedRatio;

    if (Platform.OS === 'android') {
      if (effectiveExpandedRatio >= 0.9) {
        this.expandedHeight -= this.statusBarHeight;
      }
    }
    if (Platform.OS === 'ios') {
      if (effectiveExpandedRatio >= 0.9) {
        this.expandedHeight -= this.defaultTopInset;
      }
    }

    // Initialize shared values in constructor using makeMutable (not hooks)
    // makeMutable can be called outside of React components
    this.translateY = makeMutable(SCREEN_HEIGHT);
    this.backdropOpacity = makeMutable(0);
    this.sheetHeight = makeMutable(this.calculatedHeight);
    this.lastGestureDyShared = makeMutable(0);

    this.updateState({
      isBottomsheetVisible: this.props.showonrender || false
    } as WmBottomsheetState);

    // Initialize values immediately to prevent flicker
    if (this.props.showonrender) {
      this.translateY.value = 0;
      this.backdropOpacity.value = 1;
    }

    // Local ModalService for content rendered inside Bottomsheet
    this.sheetModalService = {
      refresh: () => this.forceUpdate(),
      showModal: (options: ModalOptions) => {
        const exists = this.state.localModalsOpened.find(o => o === options);
        if (!exists) {
          // ensure high z-index within sheet
          (options as any).elevationIndex = 9999 + this.state.localModalsOpened.length + 1;
          const list = [...this.state.localModalsOpened, options];
          this.updateState({ localModalsOpened: list } as WmBottomsheetState, () => {
            setTimeout(() => options.onOpen && options.onOpen(), 0);
          });
        }
      },
      hideModal: (options?: ModalOptions) => {
        const list = [...this.state.localModalsOpened];
        const idx = options ? list.findIndex(o => o === options) : (list.length - 1);
        if (idx >= 0) {
          const o = list[idx];
          o && o.onClose && o.onClose();
          list.splice(idx, 1);
          this.updateState({ localModalsOpened: list } as WmBottomsheetState);
        }
      }
    };
  }

  componentDidMount() {
    super.componentDidMount();

    // Trigger animation after mount if showonrender is true
    if (this.state.isBottomsheetVisible) {
      // Use requestAnimationFrame to ensure animation happens after initial render
      requestAnimationFrame(() => {
        this.openSheet();
      });
    }

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardHide);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  private handleBackPress = () => {
    // Close top-most local modal first, if any
    if (this.state.localModalsOpened && this.state.localModalsOpened.length > 0) {
      const top = this.state.localModalsOpened[this.state.localModalsOpened.length - 1];
      this.sheetModalService.hideModal(top);
      return true;
    }
    if (this.state.isBottomsheetVisible) {
      if (!this.props.disableswipedownclose && this.props.autoclose !== 'disabled') {
        this.closeSheet();
      }
      return true; // Prevent default back action
    }
    return false;
  };

  private onKeyboardShow = (event: any) => {
    let keyboardHeight = event.endCoordinates?.height || 0;
    //only storing ios keyboard height once as first time keyboard open (to avoid scroll flickring issue in ios in text widget)
    if (!this.isIosKeyboardHeightSet) {
      this.iosKeyboardHeight = event.endCoordinates?.height + 40;
      this.isIosKeyboardHeightSet = true;
    }
    // Calculate available space after keyboard
    const availableHeight = SCREEN_HEIGHT - (Platform.OS == 'ios' ? this.iosKeyboardHeight : keyboardHeight);
    // Calculate adjusted sheet height to fit within available space
    // Leave some buffer space for the drag handle and safe area
    const bufferSpace = (Platform.OS === 'ios' ? this.topInset : this.statusBarHeight) + 20;
    const adjustedHeight = availableHeight - bufferSpace;

    if (this.sheetHeight && Platform.OS == 'android' && this.props.modal) {
      // Use platform-specific keyboard animation duration for smooth synchronization
      this.sheetHeight.value = withTiming(adjustedHeight, {
        duration: this.keyboardAnimationDuration,
        easing: Easing.out(Easing.ease)
      });
    }

    this.updateState({
      keyboardHeight: keyboardHeight,
    } as WmBottomsheetState);
  };

  private onKeyboardHide = () => {
    if (this.sheetHeight && Platform.OS == 'android' && this.props.modal) {
      // Use platform-specific keyboard animation duration for smooth synchronization
      this.sheetHeight.value = withTiming(
        this.state.isExpanded ? this.expandedHeight : this.calculatedHeight,
        {
          duration: this.keyboardAnimationDuration,
          easing: Easing.out(Easing.ease)
        }
      );
    }

    this.updateState({
      keyboardHeight: 0,
    } as WmBottomsheetState);
  };

  componentDidUpdate(prevProps: WmBottomsheetProps) {
    if (prevProps.bottomsheetheightratio !== this.props.bottomsheetheightratio) {
      this.calculatedHeight = this.calculateSheetHeight(this.props.bottomsheetheightratio);
      if (this.sheetHeight) {
        this.sheetHeight.value = this.calculatedHeight;
      }
    }
  }

  handleSwipeGesture = (gestureState: PanResponderGestureState) => {

    // Only reset lastGestureDy for traditional behavior, not for drag and settle
    if (!this.props.enabledragsettle) {
      this.updateState({
        lastGestureDy: 0
      } as WmBottomsheetState);
      if (this.lastGestureDyShared) {
        this.lastGestureDyShared.value = 0;
      }
    }

    if (this.props.enabledragsettle && gestureState.dy > 0) {
      const currentTranslateY = this.translateY?.value || 0;

      if (gestureState.vy > 0.5 && !this.props.disableswipedownclose) {
        this.closeSheet();
        return;
      }

      if (this.translateY && this.lastGestureDyShared) {
        this.translateY.value = currentTranslateY;
        this.lastGestureDyShared.value = currentTranslateY;
      }

      this.updateState({
        isExpanded: false,
        lastGestureDy: currentTranslateY
      } as WmBottomsheetState);
      return;
    }

    if (gestureState.dy > 0) {
      if (this.state.isExpanded || this.props.disableswipedownclose) {
        if (gestureState.dy < this.expandedHeight / 4 || this.props.disableswipedownclose) {
          let sheetMinimumHeight = this.props.bottomsheetminimumheight || 0.1;
          const targetHeight = this.props.disableswipedownclose ? sheetMinimumHeight * SCREEN_HEIGHT : this.calculatedHeight;
          const currentHeight = this.sheetHeight?.value || this.expandedHeight;
          const distance = Math.abs(currentHeight - targetHeight);
          const duration = this.getAnimationDuration(distance, gestureState.vy);

          const callback = () => {
            this.updateState({
              isExpanded: false
            } as WmBottomsheetState);
            this.invokeEventCallback('onCollapse', [null, this]);
          };

          if (this.translateY && this.sheetHeight) {
            this.translateY.value = withTiming(0, {
              duration: duration,
              easing: Easing.out(Easing.ease)
            });
            this.sheetHeight.value = withTiming(
              targetHeight,
              {
                duration: duration,
                easing: Easing.out(Easing.ease)
              },
              (finished) => {
                if (finished) {
                  runOnJS(callback)();
                }
              }
            );
          }
        } else if ((gestureState.dy > this.expandedHeight / 4 || gestureState.vy > 0.5) && !this.props.disableswipedownclose) {
          this.closeSheet();
        }
      } else {
        if (this.props.disableswipedownclose) {
          this.openSheet();
          return;
        }
        if ((gestureState.dy > 100 || gestureState.vy > 0.5) &&  !this.props.disableswipedownclose) {
          this.closeSheet();
        } else {
          this.openSheet();
        }
      }
    }
  }
  // panResponder for bottom sheet scroll view
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      // Only handle the gesture if we're at the top and swiping down
      return gestureState.dy > 0 && this.state.scrollOffset <= 0;
    },

    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only handle the gesture if we're at the top and swiping down
      return gestureState.dy > 0 && this.state.scrollOffset <= 0;
    },

    onPanResponderGrant: () => {
      // Cancel any ongoing animations when user starts dragging
      if (this.translateY) {
        cancelAnimation(this.translateY);
      }
    },

    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0 && this.translateY && this.lastGestureDyShared) {
        const newTranslateY = Math.max(0, this.lastGestureDyShared.value + gestureState.dy);
        this.translateY.value = newTranslateY;
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      this.handleSwipeGesture(gestureState);
    },

    onPanResponderTerminate: () => {
      this.openSheet();
    },
  });

  //pan repsoneder for bottom sheet dragable container
  dragHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      // Cancel any ongoing animations when user starts dragging
      if (this.translateY) {
        cancelAnimation(this.translateY);
      }
      // Reset the expand flag
      this.isDragHandleExpanding = false;
    },

    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0 && this.translateY && this.lastGestureDyShared) {
        const newTranslateY = Math.max(0, this.lastGestureDyShared.value + gestureState.dy);
        this.translateY.value = newTranslateY;
        // Reset expand flag if dragging down
        this.isDragHandleExpanding = false;
      } else if (gestureState.dy < -50 && this.props.expand && this.props.bottomsheetheightratio !== 1 && !this.isDragHandleExpanding && !this.state.isExpanded) {
        // Only trigger expand once with threshold of -50px upward drag
        this.isDragHandleExpanding = true;
        this.expandBottomSheet();
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      this.isDragHandleExpanding = false;
      this.handleSwipeGesture(gestureState);
    },
  });

  handleScroll = (event: any): any => {
    if (this.state.keyboardHeight > 0) return null;
    const offsetY = event.nativeEvent.contentOffset.y;
    this.updateState({
      isScrolling: offsetY > 0,
      scrollOffset: offsetY
    } as WmBottomsheetState);
  };

  openSheet = () => {
    const callback = () => {
      this.updateState({
        lastGestureDy: 0,
      } as WmBottomsheetState);
      this.invokeEventCallback('onOpened', [null, this]);
    };

    // Reset drag settle value immediately on UI thread
    if (this.lastGestureDyShared) {
      this.lastGestureDyShared.value = 0;
    }

    if (this.translateY && this.backdropOpacity) {
      this.translateY.value = withTiming(0, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      }, (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      });
      // Backdrop animation synchronized with sheet animation
      this.backdropOpacity.value = withTiming(1, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      });
    }
  };

  private handleClose = () => {
    this.updateState({
      isBottomsheetVisible: false
    } as WmBottomsheetState);
    this.invokeEventCallback('onClose', [null, this]);
  };

  closeSheet = () => {
    const callback = () => {
      // Reset sheet height after close
      if (this.sheetHeight) {
        this.sheetHeight.value = this.calculatedHeight;
      }
      this.updateState({
        isExpanded: false,
        localModalsOpened: [] as ModalOptions[]
      } as WmBottomsheetState);
      this.handleClose();
    };

    if (this.translateY && this.backdropOpacity) {
      this.translateY.value = withTiming(SCREEN_HEIGHT, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      }, (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      });
      // Backdrop animation synchronized with sheet animation
      this.backdropOpacity.value = withTiming(0, {
        duration: this.animationDuration,
        easing: Easing.out(Easing.ease)
      });
    }
  };

  closeSheetImmediate = () => {
    if (this.translateY && this.backdropOpacity && this.lastGestureDyShared) {
      this.translateY.value = SCREEN_HEIGHT;
      this.backdropOpacity.value = 0;
      this.lastGestureDyShared.value = 0;
    }

    this.updateState({
      lastGestureDy: 0,
      isExpanded: false,
      isBottomsheetVisible: false,
      localModalsOpened: [] as ModalOptions[]
    } as WmBottomsheetState);

    requestAnimationFrame(() => {
      if (this.sheetHeight) {
        this.sheetHeight.value = this.calculatedHeight;
      }
    });
  };

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
    switch (name) {
      case "showonrender":
        if ($new) {
          this.updateState({
            isBottomsheetVisible: $new || false
          } as WmBottomsheetState);
          if (this.state.isBottomsheetVisible) {
            this.openSheet && this.openSheet();
          }
        } else {
          this.closeSheetImmediate && this.closeSheetImmediate();
        }
        break;
    }
  }

  public renderSkeleton(props: WmBottomsheetProps) {
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: this.styles.root.width as DimensionValue,
      height: this.styles.root.height as DimensionValue
    });
  }

  // Class methods to prevent recreation on every render
  private handleBackdropPress = () => {
    if (this.props.autoclose !== 'disabled') {
      this.closeSheet();
    }
  };

  private handleDragHandlePress = () => {
    this.invokeEventCallback('onDraghandleiconclick', [null, this]);
  };

  private renderContent = (props: WmBottomsheetProps) => {
    // Don't render if shared values aren't initialized yet
    if (!this.translateY || !this.backdropOpacity || !this.sheetHeight || !this.lastGestureDyShared) {
      return null;
    }

    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          // Store topInset for later use (avoid mutation during render)
          const topInset = insets?.top || 0;
          // Update the instance variable outside of render cycle
          if (this.topInset !== topInset) {
            requestAnimationFrame(() => {
              this.topInset = topInset;
            });
          }
          return (
            <View style={this.styles.root} {...this.getTestProps('keyboardview')}>
              {this._background}

              <AnimatedBottomsheetContent
                translateY={this.translateY}
                backdropOpacity={this.backdropOpacity}
                sheetHeight={this.sheetHeight}
                lastGestureDy={this.lastGestureDyShared}
                styles={this.styles}
                props={props}
                panHandlers={this.panResponder.panHandlers}
                dragHandlePanHandlers={this.dragHandlePanResponder.panHandlers}
                onBackdropPress={this.handleBackdropPress}
                onDragHandlePress={this.handleDragHandlePress}
                getTestProps={this.getTestProps.bind(this)}
                enabledragsettle={props.enabledragsettle}
              >
                {(contentStyle: any) => (
                  <ScrollView
                    ref={this.state.scrollViewRef}
                    style={this.styles.sheetContentContainer}
                    contentContainerStyle={[this.styles.sheetScrollContent]}
                    alwaysBounceVertical={false}
                    alwaysBounceHorizontal={false}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={this.handleScroll}
                    nestedScrollEnabled={true}
                    scrollEnabled={!props.issticky && (!props.disablescrollonrest || this.state.isExpanded)}
                    {...this.getTestProps('scorllview')}
                  >
                    {props.enablemodalsupport ? (
                      <ModalProvider value={this.sheetModalService}>
                        <Animated.View style={contentStyle}>
                          {props.children}
                        </Animated.View>
                      </ModalProvider>
                    ) : (
                      <Animated.View style={contentStyle}>
                        {props.children}
                      </Animated.View>
                    )}
                  </ScrollView>
                )}
              </AnimatedBottomsheetContent>

              {props.enablemodalsupport && this.state.localModalsOpened && this.state.localModalsOpened.map((o, i) => (
                <View
                  key={(o.name || '') + i}
                  onStartShouldSetResponder={() => true}
                  onResponderEnd={() => o.isModal && this.sheetModalService.hideModal(o)}
                  style={[
                    this.styles.modalOverlay,
                    (o as any).centered ? this.styles.centeredOverlay : null,
                    { zIndex: (o as any).elevationIndex || 9999, elevation: (o as any).elevationIndex || 9999 },
                    (o.modalStyle || {})
                  ]}
                >
                  <View
                    style={[(o.contentStyle || {})]}
                    onStartShouldSetResponder={() => true}
                    onResponderEnd={(e) => e.stopPropagation()}
                  >
                    {o.content}
                  </View>
                </View>
              ))}
            </View>
          );
        }}
      </SafeAreaInsetsContext.Consumer>
    );
  };

  renderWidget(props: WmBottomsheetProps) {
    if (!this.state.isBottomsheetVisible) return null;

    if (props.modal) {

      return (
        <Modal
          visible={this.state.isBottomsheetVisible}
          transparent={true}
          animationType="none"
          onRequestClose={() => {
            if (!this.props.disableswipedownclose && this.props.autoclose !== 'disabled') {
              this.closeSheet();
            }
          }}
          statusBarTranslucent={false}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}
          >
            {this.renderContent(props)}
          </KeyboardAvoidingView>
        </Modal>
      );
    } else {
      return this.renderContent(props);
    }
  }
}