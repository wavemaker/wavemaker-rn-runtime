import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { GestureResponderEvent, Platform, View } from "react-native";
import { get } from "lodash";
import injector from "./injector";
import { TouchableRipple } from "react-native-paper";

interface TappableProps {
    testID?: string;
    children?: any
    styles?: any;
    target?: BaseComponent<any, any, any>;
    onTap?: (e: any) => void;
    onLongTap?: (e: any) => void; 
    onDoubleTap?: (e: any) => void;
    onTouchStart? : (e: any) => void;
    onTouchEnd? : (e: any) => void;
}

export class TapEvent {
    propagationEnabled = true;
   
    constructor() {

    }

    stopPropagation() {
        this.propagationEnabled = false;
    }
}

export class Tappable extends React.Component<TappableProps, any> {
    private lastPress = 0;
    private lastTap = 0;
    private lastDoubleTap = 0;
    private isLongTap = false;

    static CURRENT_EVENT: TapEvent = null as any;
   
    constructor(props: any) {
        super(props);
    }

    onPress(e?: GestureResponderEvent): void {        
        this.lastPress = Date.now();
        const target = this.props.target;
        if (!Tappable.CURRENT_EVENT) {
            Tappable.CURRENT_EVENT = new TapEvent();
            setTimeout(() => {
                Tappable.CURRENT_EVENT = null as any;
            }, 10);
        }
        const syntheticEvent = Tappable.CURRENT_EVENT;
        this.props.onTouchStart && this.props.onTouchStart(e || syntheticEvent);
        this.props.target?.invokeEventCallback('onTouchstart', [syntheticEvent, this.props.target]);
        const currentTime = Date.now();
        const tapDelta = currentTime - this.lastTap;
        if (this.isLongTap) {
            this.isLongTap = false;
            return;
        }
        if (syntheticEvent.propagationEnabled) {
            injector.FOCUSED_ELEMENT.get()?.blur();
            if(this.lastDoubleTap !== this.lastTap 
                && tapDelta < 500) {
                this.props.onDoubleTap && this.props.onDoubleTap(e);
                setTimeout(() => {
                    target?.invokeEventCallback('onDoubletap', [syntheticEvent, target]);
                }, 200);
                this.lastDoubleTap = currentTime;
            }
            setTimeout(() => {
                if (this.props.onTap) {
                    this.props.onTap(e || syntheticEvent);
                } else {
                    target?.invokeEventCallback('onTap', [syntheticEvent, target]);
                }
            }, 200);
            this.lastTap = currentTime;
        }
    }

    onLongTap(e?: GestureResponderEvent): void {
        const syntheticEvent = Tappable.CURRENT_EVENT;
        this.props.onLongTap && this.props.onLongTap(e || syntheticEvent);
        setTimeout(() => {
            this.props.target?.invokeEventCallback('onLongtap', [syntheticEvent, this.props.target]);
        }, 200);
        this.isLongTap = true;
    }
    
    onPressOut(e?: GestureResponderEvent): void {
        const syntheticEvent = Tappable.CURRENT_EVENT;
        this.props.onTouchEnd && this.props.onTouchEnd(e || syntheticEvent);
        setTimeout(() => {
            this.props.target?.invokeEventCallback('onTouchend', [syntheticEvent, this.props.target]);
        }, 200);
    }

    render() {
        const target = this.props.target;
        if (target?.props.onTap 
            || target?.props.onLongtap 
            || target?.props.onDoubletap 
            || this.props.onTap 
            || this.props.onLongTap 
            || this.props.onDoubleTap) {
            return (
                <TouchableRipple
                rippleColor="rgba(0, 0, 0, 0)" 
                borderless = {true}
                 {...(Platform.OS === 'android' || Platform.OS === 'web') ? {
                    accessibilityLabel: this.props.testID,
                    testID: this.props.testID
                }: {
                    accessible: false,
                    testID: this.props.testID
                }} 
                disabled={get(target?.proxy, 'disabled')}
                style={this.props.styles}
                onPress={() => this.onPress()}
                onLongPress={() => this.onLongTap()}
                onPressOut={() => this.onPressOut()}>
                    <>{this.props.children}</>
                </TouchableRipple>
            );
        }
        return (<View style={this.props.styles}>{this.props.children}</View>);
    }
}
