import React, { createRef } from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Text, View, Animated, PanResponder, Dimensions, TouchableWithoutFeedback, Platform, ScrollView,SafeAreaView, StatusBar,BackHandler } from 'react-native';
import WmBottomsheetProps from './bottomsheet.props';
import { DEFAULT_CLASS, WmBottomsheetStyles } from './bottomsheet.styles';



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
}

export default class WmBottomsheet extends BaseComponent<WmBottomsheetProps, WmBottomsheetState, WmBottomsheetStyles> {
  private calculatedHeight: number;
  private expandedHeight: number;
  private defaultHeight: number = 0.2;
  private expandedDefaultHeight: number = 0.5;
  private maxHeight: number = 1.0; // Allow full screen height
  private isBottomsheetVisible: boolean = false;
  private animationDuration:number = 400
  private statusBarHeight:number = StatusBar.currentHeight || 0;
  private defaultTopInset:number = 44;

  private calculateSheetHeight(sheetheightratio: number): number {
    // Allow full range from 0.2 to 1.0 (100% of screen height)
    const maxHeightRatio = Math.min(
      sheetheightratio >= this.defaultHeight ? sheetheightratio : this.defaultHeight, 
      this.maxHeight
    );
    
    let calculatedHeight = SCREEN_HEIGHT * maxHeightRatio;
    
    // Add safe area top inset for iOS
    if (Platform.OS === 'ios') {
       // Common value for iPhone X and newer
      // Subtract top inset  bar height for ios only if sheet height ration is 0.9
      if (maxHeightRatio >= 0.9) {
        calculatedHeight -= this.defaultTopInset;
      }
    } 
    else if (Platform.OS === 'android') {
      // Subtract status bar height for Android only if sheet height ration is 0.9
      if (maxHeightRatio >= 0.9) {
         calculatedHeight -= this.statusBarHeight;
      }
     
    }
    
    console.log("device height is", SCREEN_HEIGHT);
    console.log(maxHeightRatio,"height is", SCREEN_HEIGHT*maxHeightRatio);
    console.log("height ratio is", maxHeightRatio);
    console.log("calculated height is", calculatedHeight);
    return calculatedHeight;
  }

  constructor(props: WmBottomsheetProps) {
    super(props, DEFAULT_CLASS, new WmBottomsheetProps(), new WmBottomsheetState());
    this.calculatedHeight = this.calculateSheetHeight(props.sheetheightratio);
    
    // Allow expanded height to be full screen
    const expandedRatio = props.expandedheightratio || this.expandedDefaultHeight;

  
    this.expandedHeight = SCREEN_HEIGHT * Math.max(
      this.expandedDefaultHeight, 
      Math.min(expandedRatio, this.maxHeight)
    );

    if(Platform.OS === 'android') {
      // Subtract status bar height for Android only if sheet height ration is 0.9
      if (expandedRatio >= 0.9) {
         this.expandedHeight -= this.statusBarHeight;
      }
     
    }
    if (Platform.OS === 'ios') {
      // Subtract top inset  bar height for ios only if sheet height ration is 0.9
      if (expandedRatio >= 0.9) {
        this.expandedHeight -= this.defaultTopInset;
      }
    } 
    this.state.sheetHeight.setValue(this.calculatedHeight);

    this.isBottomsheetVisible = this.props.visible || false;
    if (this.isBottomsheetVisible) {
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
    if (this.isBottomsheetVisible) {
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
      this.updateState({
        lastGestureDy: 0
      } as WmBottomsheetState);

      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        this.closeSheet();
      } else {
        this.openSheet();
      }
    },

    onPanResponderTerminate: () => {
      this.openSheet();
    },
  });

  dragHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      console.log("y values ",gestureState.dy)
      if (gestureState.dy > 0) { // Handle downward drag
        const newTranslateY = Math.max(0, this.state.lastGestureDy + gestureState.dy);
        this.state.translateY.setValue(newTranslateY);
      } else if (gestureState.dy < 0 && this.props.bottompopup && this.props.sheetheightratio !==1) { 
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
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        this.closeSheet();
      } else {
        this.openSheet();
      }
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
    ]).start();
  };

  private handleClose = () => {
    this.isBottomsheetVisible = false;
    this.props.onClose?.();
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
      isExpanded: false
    } as WmBottomsheetState);
    requestAnimationFrame(() => {
      this.state.sheetHeight.setValue(this.calculatedHeight);
      this.handleClose();
    });
  };

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
    switch (name) {
      case "visible":
        if ($new) {
          this.isBottomsheetVisible = $new || false;
          if (this.isBottomsheetVisible) {
            this.openSheet && this.openSheet();
          }
        } else {
          this.closeSheetImmediate && this.closeSheetImmediate();
        }
        break;
    }
  }

  renderWidget(props: WmBottomsheetProps) {
    if (!this.isBottomsheetVisible || !props.visible) return null;
    
    return (
     
       <View style={this.styles.root}>
         {this._background}
        <TouchableWithoutFeedback onPress={this.closeSheet}>
          <Animated.View style={[this.styles.backdrop, { opacity: this.state.backdropOpacity }]} />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            this.styles.sheetContainer,
            {
              height: this.state.sheetHeight,
              transform: [{ translateY: this.state.translateY }],
            },
          ]}
          {...this.panResponder.panHandlers}
        >
          <View style={this.styles.dragHandleContainer} {...this.dragHandlePanResponder.panHandlers}>
            <TouchableWithoutFeedback onPress={this.closeSheet}>
              <View style={this.styles.dragHandle} />
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
          >
            {this.props.children}
          </ScrollView>
        </Animated.View>
      </View>
     
    );
  }
}
