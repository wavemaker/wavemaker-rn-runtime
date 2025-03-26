import { isNil } from 'lodash-es';
import React from 'react';
import { Animated, Easing, View as RNView, ViewStyle, LayoutChangeEvent, LayoutRectangle, DimensionValue, PanResponder } from 'react-native';
import { Gesture, GestureDetector, GestureUpdateEvent } from 'react-native-gesture-handler';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import injector from '@wavemaker/app-rn-runtime/core/injector';

export class Handlers {
    bounds?: (g: GestureUpdateEvent<any>) => Bounds = null as any;
    onAnimation?: (g: GestureUpdateEvent<any>) => any = () => { };
    onLower?: (g: GestureUpdateEvent<any>) => any = () => { };
    onUpper?: (g: GestureUpdateEvent<any>) => any = () => { };
    computePhase?: (value: number) => number = null as any;
}

export interface Bounds {
    upper?: number;
    center?: number;
    lower?: number;
}

export class Props {
    threshold?: number = 5;
    direction?: 'horizontal' | 'vertical' = 'horizontal';
    handlers?: Handlers = {} as any;
    style?: ViewStyle = {} as any;
    children: any;
    enableGestures: any;
    slideWidth?: DimensionValue = '100%';
    slideMinWidth?: DimensionValue = undefined;
    slidesLayout?: any = [];
    activeIndex?: number | null = null;
}

export class State {
    threshold = 5;
    isHorizontal = false;
    bounds: Bounds = {} as any;
    maxPosition = Number.MAX_VALUE;
}

export class View extends React.Component<Props, State> {

    static defaultProps = new Props();
    private position = new Animated.Value(0);
    public animationPhase = new Animated.Value(0);
    private i18nService = injector.I18nService.get();
    private childrenLayout: LayoutRectangle[] = [];
    private viewLayout: LayoutRectangle = null as any;
    private panResponder: any = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            isHorizontal: props.direction === 'horizontal',
            threshold: props.threshold || 5,
            bounds: {} as any
        } as State;
        var touchStart = {
            x: 0,
            y: 0,
            active: false
        };

        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) =>
                true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                true,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
            },
            onPanResponderMove: (evt, gestureState) => {
                this.onChange(gestureState)
                // The most recent move distance is gestureState.move{X,Y}
                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) =>
                true,
            onPanResponderRelease: (evt, gestureState) => {
                if (this.props.direction === 'horizontal' && (gestureState.dx > 49 || gestureState.dx < -49)) {
                    this.onEnd(gestureState);
                }
                if (this.props.direction === 'vertical' && (gestureState.dy > 49 || gestureState.dy < -49)) {
                    this.onEnd(gestureState);
                }

                if (!(gestureState.dy > 49 || gestureState.dy < -49) && !(gestureState.dx > 49 || gestureState.dx < -49)) {
                    if (this.props.activeIndex) {
                        this.setPosition(this.props.slidesLayout[this.props.activeIndex])
                    }
                }
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });

    }

    onChange = (e: any) => {
        const bounds = (this.props.handlers?.bounds && this.props.handlers?.bounds(e)) || {};
        const d = (this.state.isHorizontal ? e.dx : e.dy);
        let phase = this.computePhase(bounds?.center || 0);
        if (d && d < 0 && !isNil(bounds.center) && !isNil(bounds.lower)
            && bounds.center !== bounds.lower) {
            phase += (d / (bounds.center - bounds.lower)) || 0;
        } else if (d && d > 0 && !isNil(bounds.center) && !isNil(bounds.upper)
            && bounds.center !== bounds.upper) {
            phase += (d / (bounds.upper - bounds.center)) || 0;
        }
        this.animationPhase.setValue(phase);
        this.position.setValue(
            (this.isRTL() ? -bounds?.center! : bounds?.center || 0) + d);
    }

    onEnd = (e: any) => {
        this.props.handlers?.onAnimation &&
            this.props.handlers?.onAnimation(e);
        if (e.dx < 0) {
            this.isRTL() ? this.goToLower(e) : this.goToUpper(e);
        } else if (e.dx > 0) {
            this.isRTL() ? this.goToUpper(e) : this.goToLower(e);
        }
    }

    computeMaxScroll() {
        let max = Number.MAX_VALUE;
        const childrenWidth = this.childrenLayout.reduce((s, v) => s + v.width, 0);
        const childrenHeight = this.childrenLayout.reduce((s, v) => s + v.height, 0);
        if (this.props.direction === 'horizontal') {
            if (childrenWidth && this.viewLayout?.width) {
                max = childrenWidth - this.viewLayout.width;
            }
        } else if (childrenHeight && this.viewLayout?.height) {
            max = childrenHeight - this.viewLayout.height;
        }
        this.setState({ maxPosition: -1 * max });
    }

    setChildrenLayout(event: LayoutChangeEvent, index: number) {
        this.childrenLayout[index] = event.nativeEvent.layout;
        this.computeMaxScroll();
    }

    setViewLayout(event: LayoutChangeEvent) {
        this.viewLayout = event.nativeEvent.layout;
        this.computeMaxScroll();
    }

    computePhase(value: number) {
        return (this.props.handlers?.computePhase &&
            this.props.handlers?.computePhase(value)) || 0;
    }

    isRTL() {
        return this.i18nService.isRTLLocale();
    }

    goToLower(e?: any) {
        const bounds = (this.props.handlers?.bounds && this.props.handlers?.bounds(e)) || {};
        console.log("🚀 ~ View ~ goToLower ~ bounds:", bounds)
        this.setPosition(bounds.lower)
            .then(() => {
                if (!isNil(bounds.lower) && bounds.center !== bounds.lower) {
                    this.props.handlers?.onLower &&
                        this.props.handlers?.onLower(e);
                }
            });
    }

    goToUpper(e?: any) {
        const bounds = (this.props.handlers?.bounds && this.props.handlers?.bounds(e)) || {};
        console.log("🚀 ~ View ~ goToUpper ~ bounds:", bounds)
        this.setPosition(bounds.upper)
            .then(() => {
                if (!isNil(bounds.upper) && bounds.center !== bounds.upper) {
                    this.props.handlers?.onUpper &&
                        this.props.handlers?.onUpper(e);
                }
            });
    }

    setPosition(value: number | undefined) {
        if (isNil(value)) {
            return Promise.reject();
        }
        let position = isNaN(this.state.maxPosition) ? value : Math.max(this.state.maxPosition, value);
        return new Promise((resolve) => {
            Animated.parallel([
                Animated.timing(this.animationPhase, {
                    useNativeDriver: true,
                    toValue: this.computePhase(value),
                    duration: 200,
                    easing: Easing.out(Easing.linear)
                }),
                Animated.timing(this.position, {
                    useNativeDriver: true,
                    toValue: (this.isRTL() ? -1 : 1) * position,
                    duration: 200,
                    easing: Easing.out(Easing.linear)
                })
            ]).start(resolve);
        });
    }

    public render() {
        const isHorizontal = this.props.direction === 'horizontal';
        return (
            //@ts-ignore
            <RNView style={[
                isHorizontal ? {
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                } : null,
                this.props.style]}
                onLayout={this.setViewLayout.bind(this)}
                {...this.panResponder.panHandlers}
            >
                {this.props.children.map((c: any, i: number) => {
                    return (<Animated.View onLayout={(e) => this.setChildrenLayout(e, i)} key={c.key}
                        style={[this.props.slideMinWidth ? {
                            minWidth: this.props.slideMinWidth
                        } : {
                            width: this.props.slideWidth
                        },
                        this.props.style?.height === '100%' ? {
                            height: '100%'
                        } : null,
                        {
                            transform: this.state.isHorizontal ? [{
                                translateX: this.position
                            }] : [{
                                translateY: this.position
                            }]
                        }
                        ]}>
                        {c}
                    </Animated.View>);
                })}
            </RNView>
        );
    }

}
