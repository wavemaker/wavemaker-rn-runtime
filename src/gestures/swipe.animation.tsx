import { isNil } from 'lodash-es';
import React from  'react';
import { Animated, Easing, ViewStyle, I18nManager, Platform } from 'react-native';
import { Gesture, GestureDetector, GestureUpdateEvent } from 'react-native-gesture-handler';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import injector from '@wavemaker/app-rn-runtime/core/injector';

export class Handlers {
    bounds?: (g: GestureUpdateEvent<any>) => Bounds = null as any;
    onAnimation?: (g: GestureUpdateEvent<any>) => any = () => {};
    onLower?:  (g: GestureUpdateEvent<any>) => any = () => {};
    onUpper?:  (g: GestureUpdateEvent<any>) => any = () => {};
}

export interface Bounds {
    upper?: number;
    center?: number;
    lower?: number;
}

export class Props {
    threshold?: number = 30;
    direction?: 'horizontal' | 'vertical' = 'horizontal';
    handlers?: Handlers = {} as any;
    style?: ViewStyle = {} as any;
    children: any;
    enableGestures: any;
}

export class State {
    threshold = 30;
    isHorizontal = false;
    bounds: Bounds = {} as any;
}

export class View extends React.Component<Props, State> {

    private gesture = Gesture.Pan();
    private position = new Animated.Value(0);
    private i18nService = injector.I18nService.get();

    constructor(props: Props) {
        super(props);
        this.state = {
            isHorizontal:  props.direction === 'horizontal',
            threshold: props.threshold || 30,
            bounds: {} as any
        } as State;
        this.gesture
            .maxPointers(1)
            .minDistance(this.state.threshold)
            .enabled(this.props.enableGestures && !isWebPreviewMode())
            .onChange(e => {
                const bounds = (this.props.handlers?.bounds && this.props.handlers?.bounds(e)) || {};
                this.position.setValue(
                    (this.isRTL()?-bounds?.center! :bounds?.center || 0) +
                    (this.state.isHorizontal ? e.translationX : e.translationY));
            })
            .onEnd(e => {
                this.props.handlers?.onAnimation && 
                this.props.handlers?.onAnimation(e);
                if (e.translationX < 0) {
                    this.isRTL()?this.goToLower(e):this.goToUpper(e);
                } else if (e.translationX > 0) {
                    this.isRTL()?this.goToUpper(e):this.goToLower(e);
                }
            })

    }

    isRTL(){
        return this.i18nService.isRTLLocale();
    }

    goToLower(e?: any) {
        const bounds = (this.props.handlers?.bounds && this.props.handlers?.bounds(e)) || {};
        this.setPosition(bounds.lower)
            .then(() => {
                this.props.handlers?.onLower && 
                this.props.handlers?.onLower(e);
            });
    }

    goToUpper(e?: any) {
        const bounds = (this.props.handlers?.bounds && this.props.handlers?.bounds(e)) || {};
        this.setPosition(bounds.upper)
            .then(() => {
                this.props.handlers?.onUpper && 
                this.props.handlers?.onUpper(e);
            });
    }
    
    setPosition(value: number | undefined) {
        if (isNil(value)) {
            return Promise.reject();
        }
        return new Promise((resolve) => {
            Animated.timing(this.position, {
                useNativeDriver: true,
                toValue:  this.isRTL()?-value:value,
                duration: 200,
                easing: Easing.out(Easing.linear)
            }).start(resolve);
        });
    }

    public render() {
        return (
            //@ts-ignore
            <GestureDetector gesture={this.gesture}>
                <Animated.View style={[
                    this.props.style, 
                    {
                        transform: this.state.isHorizontal ? [{
                            translateX: this.position
                        }] : [{
                            translateY: this.position
                        }]
                    }]}>
                    {this.props.children}
                </Animated.View>
            </GestureDetector>
        );
    }

}