import React, { createRef } from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { View, Animated, PanResponder, Dimensions, TouchableWithoutFeedback, Platform, ScrollView, PanResponderGestureState, StatusBar, BackHandler, DimensionValue, KeyboardAvoidingView } from 'react-native';
import WmBottomsheetProps from './bottomsheet.props';
import { DEFAULT_CLASS, WmBottomsheetStyles } from './bottomsheet.styles';
import { createSkeleton } from '../skeleton/skeleton.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');
export class WmBottomsheetState extends BaseComponentState<WmBottomsheetProps> {
  translateY = new Animated.Value(SCREEN_HEIGHT);
  backdropOpacity = new Animated.Value(0);
  sheetHeight = new Animated.Value(0);
  lastGestureDy = 0;
  scrollViewRef = createRef<ScrollView>();
  isScrolling = false;
  scrollOffset = 0;
  isExpanded = false;
  isBottomsheetVisible = false;
}

export default class WmBottomsheet extends BaseComponent<WmBottomsheetProps, WmBottomsheetState, WmBottomsheetStyles> {
  private calculatedHeight: number;
  private expandedHeight: number;
  private defaultHeight: number = 0.5;
  private expandedDefaultHeight: number = 0.8;
  private minimumHeight: number = 0.2;
  private minimumExpandedHeight: number = 0.5;
  private maxHeight: number = 1.0; // Allow full screen height
  private animationDuration: number = 400
  private statusBarHeight: number = StatusBar.currentHeight || 0;
  private defaultTopInset: number = 44;
  private maxHeightRatio: number = 0;

  private calculateSheetHeight(sheetheightratio: number): number {
    // Use default height if ratio not provided, but ensure it's not below minimum
    const effectiveRatio = sheetheightratio || this.defaultHeight;
    this.maxHeightRatio = Math.max(
      this.minimumHeight,
      Math.min(effectiveRatio, this.maxHeight)
    );

    let calculatedHeight = SCREEN_HEIGHT * this.maxHeightRatio;

    if (Platform.OS === 'ios') {
      // Subtract top inset bar height for ios only if sheetheightratio is 0.9
      if (this.maxHeightRatio >= 0.9) {
        calculatedHeight -= this.defaultTopInset;
      }
    }
    else if (Platform.OS === 'android') {
      // Subtract status bar height for Android only if sheetheightratio is 0.9
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

  constructor(props: WmBottomsheetProps) {
    super(props, DEFAULT_CLASS, new WmBottomsheetProps(), new WmBottomsheetState());
    this.calculatedHeight = this.calculateSheetHeight(props.sheetheightratio);

    // Use expandedheightratio if provided, otherwise use expandedDefaultHeight
    const expandedRatio = props.expandedheightratio || this.expandedDefaultHeight;
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
    this.state.sheetHeight.setValue(this.calculatedHeight);

    this.updateState({
      isBottomsheetVisible: this.props.visible || false
    } as WmBottomsheetState);

    if (this.state.isBottomsheetVisible) {
      this.openSheet();
    } else {
      this.closeSheetImmediate();
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  }

  private handleBackPress = () => {
    if (this.state.isBottomsheetVisible) {
      this.closeSheet();
      return true; // Prevent default back action
    }
    return false;
  };

  componentDidUpdate(prevProps: WmBottomsheetProps) {
    if (prevProps.sheetheightratio !== this.props.sheetheightratio) {
      this.calculatedHeight = this.calculateSheetHeight(this.props.sheetheightratio);
      this.state.sheetHeight.setValue(this.calculatedHeight);
    }
  }

  handleSwipeGesture = (gestureState: PanResponderGestureState) => {
    this.updateState({
      lastGestureDy: 0
    } as WmBottomsheetState);
    if (gestureState.dy > 0) {
      if (this.state.isExpanded) {
        // Expand the bottom sheet threshold is  25% of the fully expanded height
        // If the user swipe distance is below the threshold, revert to the original sheet height
        if (gestureState.dy < this.expandedHeight / 4) {
          Animated.parallel([
            Animated.timing(this.state.translateY, {
              toValue: 0, // Keep sheet open
              duration: this.animationDuration,
              useNativeDriver: false,
            }),
            Animated.timing(this.state.sheetHeight, {
              toValue: this.calculatedHeight, // Back to original height
              duration: this.animationDuration,
              useNativeDriver: false,
            })
          ]).start();
          this.updateState({
            isExpanded: false
          } as WmBottomsheetState);
        }
        else if (gestureState.dy > this.expandedHeight / 4 || gestureState.vy > 0.5) {
          this.closeSheet();
        }
      }
      else {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
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

    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        const newTranslateY = Math.max(0, this.state.lastGestureDy + gestureState.dy);
        this.state.translateY.setValue(newTranslateY);

      }
    },

    onPanResponderRelease: (_, gestureState) => {
      this.handleSwipeGesture(gestureState)
    },

    onPanResponderTerminate: () => {
      this.openSheet();
    },
  });

  //pan repsoneder for bottom sheet dragable container
  dragHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {

      if (gestureState.dy > 0) { // Handle downward drag
        const newTranslateY = Math.max(0, this.state.lastGestureDy + gestureState.dy);
        this.state.translateY.setValue(newTranslateY);
      } else if (gestureState.dy < 0 && this.props.shouldexpand && this.props.sheetheightratio !== 1) {
        // Handle upward drag - expand to full height
        // Allow expansion to full screen height
        const targetHeight = Math.min(this.expandedHeight, SCREEN_HEIGHT);
        Animated.timing(this.state.sheetHeight, {
          toValue: targetHeight,
          duration: this.animationDuration,
          useNativeDriver: false,
        }).start();
        this.updateState({
          isExpanded: true
        } as WmBottomsheetState);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      this.handleSwipeGesture(gestureState)
    },
  });

  handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    this.updateState({
      isScrolling: offsetY > 0,
      scrollOffset: offsetY
    } as WmBottomsheetState);
  };

  openSheet = () => {
    this.updateState({
      lastGestureDy: 0,
    } as WmBottomsheetState);

    Animated.parallel([
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: this.animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.backdropOpacity, {
        toValue: 1,
        duration: this.animationDuration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      this.invokeEventCallback('onOpened', [null, this]);
    });
  };

  private handleClose = () => {
    this.updateState({
      isBottomsheetVisible: false
    } as WmBottomsheetState);
    this.invokeEventCallback('onClose', [null, this]);
  };

  closeSheet = () => {
    Animated.parallel([
      Animated.timing(this.state.translateY, {
        toValue: SCREEN_HEIGHT,
        duration: this.animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.backdropOpacity, {
        toValue: 0,
        duration: this.animationDuration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      requestAnimationFrame(() => {
        this.state.sheetHeight.setValue(this.calculatedHeight);
        this.updateState({
          isExpanded: false
        } as WmBottomsheetState);
        this.handleClose();
      });
    });
  };

  closeSheetImmediate = () => {
    this.state.translateY.setValue(SCREEN_HEIGHT);
    this.state.backdropOpacity.setValue(0);
    this.updateState({
      lastGestureDy: 0,
      isExpanded: false,
      isBottomsheetVisible: false
    } as WmBottomsheetState);
    requestAnimationFrame(() => {
      this.state.sheetHeight.setValue(this.calculatedHeight);
    });
  };

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
    switch (name) {
      case "visible":
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

  renderWidget(props: WmBottomsheetProps) {
    if (!this.state.isBottomsheetVisible) return null;

    return (
      <SafeAreaInsetsContext.Consumer >
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          const keyboardOffset = insets?.bottom || 0
          const verticalOffset = Platform.OS === 'ios' ? keyboardOffset + props.keyboardverticaloffset : keyboardOffset;
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={verticalOffset}
              style={this.styles.root}
              {...this.getTestProps('keyboardview')}
            
            >

              {this._background}
              <TouchableWithoutFeedback onPress={this.closeSheet}>
                <Animated.View style={[this.styles.backdrop, { opacity: this.state.backdropOpacity }]} 
                  {...this.getTestProps('backdrop')}
                  {...getAccessibilityProps(AccessibilityWidgetType.BOTTOMSHEET, props)}
                  />
              </TouchableWithoutFeedback>

              <Animated.View
                style={[
                  this.styles.container,
                  {
                    height: this.state.sheetHeight,
                    transform: [{ translateY: this.state.translateY }],
                  },
                ]}
                {...this.panResponder.panHandlers}


              >
                <View style={this.styles.dragHandleContainer} {...this.dragHandlePanResponder.panHandlers}>
                  <TouchableWithoutFeedback onPress={this.closeSheet}>
                    <View style={this.styles.dragIconHandle} 
                     {...this.getTestProps('draghandle')}/>
                  </TouchableWithoutFeedback>
                </View>

                <ScrollView
                  ref={this.state.scrollViewRef}
                  style={this.styles.sheetContentContainer}
                  contentContainerStyle={this.styles.sheetScrollContent}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={16}
                  onScroll={this.handleScroll}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  {...this.getTestProps('scorllview')}


                >
                  {props.children}
                </ScrollView>

              </Animated.View>

            </KeyboardAvoidingView>
          )
        }}
      </SafeAreaInsetsContext.Consumer>


    );
  }
}
