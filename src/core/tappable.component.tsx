import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { GestureResponderEvent, Platform, View, TouchableOpacity } from "react-native";
import { get } from "lodash";
import injector from "./injector";
import { TouchableRipple } from "react-native-paper";
import ThemeVariables from "../styles/theme.variables";

export const TappableContext = React.createContext<Tappable>(null as any);
import { UIPreferencesConsumer, UI_PREFERENCES } from "./ui-preferences.context";

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
    rippleColor?: string;
    accessibilityProps?: any;
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

    onPress(e: TapEvent): void {   
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

    onLongTap(e: TapEvent): void {
        const syntheticEvent = Tappable.CURRENT_EVENT;
        this.props.onLongTap && this.props.onLongTap(e || syntheticEvent);
        setTimeout(() => {
            this.props.target?.invokeEventCallback('onLongtap', [syntheticEvent, this.props.target]);
        }, 200);
        this.isLongTap = true;
    }
    
    onPressOut(e: TapEvent): void {
        const syntheticEvent = Tappable.CURRENT_EVENT;
        this.props.onTouchEnd && this.props.onTouchEnd(e || syntheticEvent);
        setTimeout(() => {
            this.props.target?.invokeEventCallback('onTouchend', [syntheticEvent, this.props.target]);
        }, 200);
        this.isLongTap = false;
    }

    render() {
        const target = this.props.target;
        const commonProps = {
            ...(Platform.OS === 'android' || Platform.OS === 'web') ? {
                accessibilityLabel: this.props.testID,
                testID: this.props.testID
            }: {
                // accessible: false,
                testID: this.props.testID
            },
            ...this.props.accessibilityProps,
            disabled:get(target?.proxy, 'disabled'),
            style:this.props.styles,
            onPress:(e?: GestureResponderEvent) => {
                if ((e?.target as any)?.tagName === 'INPUT') {
                    return;
                }
                this.onPress(new TapEvent())
            },
            onLongPress:(e?: GestureResponderEvent) => this.onLongTap(new TapEvent()),
            onPressOut:(e?: GestureResponderEvent) => this.onPressOut(new TapEvent())
        };
        if (target?.props.onTap 
            || target?.props.onLongtap 
            || target?.props.onDoubletap 
            || this.props.onTap 
            || this.props.onLongTap 
            || this.props.onDoubleTap) {
            return (
            <UIPreferencesConsumer>
                {(preferences: UI_PREFERENCES) => {
                    return preferences.enableRipple ? (
                    <TouchableRipple rippleColor={this.props.rippleColor} borderless={true} {...commonProps}>
                        <>{this.props.children}</>
                    </TouchableRipple>): (
                    <TouchableOpacity {...commonProps}>
                        <>{this.props.children}</>
                    </TouchableOpacity>);
                }}
            </UIPreferencesConsumer>
            );
        }
        return (<View style={this.props.styles}>{this.props.children}</View>);
    }
}
