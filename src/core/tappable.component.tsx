import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { GestureResponderEvent, Platform, View, TouchableOpacity } from "react-native";
import { get } from "lodash";
import injector from "./injector";
import { TouchableRipple } from "react-native-paper";
import ThemeVariables from "../styles/theme.variables";
import { isDefined } from "./utils";

export const TappableContext = React.createContext<Tappable>(null as any);
import { UIPreferencesConsumer, UI_PREFERENCES } from "./ui-preferences.context";

export const ParentTappableContext = React.createContext<Tappable>(null as any);
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
    disableTouchEffect?:boolean;
    onLayout?: any;
}

export class SyntheticEvent {
    // as the event is being used in onPress, onPressOut and onLongTap the TapEvent is renamed to SyntheticEvent
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
    private parent:Tappable = null as any;
   
    constructor(props: any) {
        super(props);
    }

    async triggerTap(e = new SyntheticEvent()) {
        if (!e.propagationEnabled) {
            return;
        }
        const target = this.props.target;
        if (this.props.onTap) {
            await this.props.onTap(e);
        } else {
            await target?.invokeEventCallback('onTap', [e, target]);
        }
        this.parent?.triggerTap(e);
    }

    onPress(e: SyntheticEvent): void {   
        this.lastPress = Date.now();
        const target = this.props.target;
        this.props.onTouchStart && this.props.onTouchStart(e);
        this.props.target?.invokeEventCallback('onTouchstart', [e, this.props.target]);
        const currentTime = Date.now();
        const tapDelta = currentTime - this.lastTap;
        if (this.isLongTap) {
            this.isLongTap = false;
            return;
        }
        if (e.propagationEnabled) {
            injector.FOCUSED_ELEMENT.get()?.blur();
            if(this.lastDoubleTap !== this.lastTap 
                && tapDelta < 500) {
                this.props.onDoubleTap && this.props.onDoubleTap(e);
                setTimeout(() => {
                    target?.invokeEventCallback('onDoubletap', [e, target]);
                }, 200);
                this.lastDoubleTap = currentTime;
            }
            setTimeout(() => {
                if (!e.propagationEnabled) {
                    return;
                }
                if (this.props.onTap) {
                    this.props.onTap(e);
                } else {
                    target?.invokeEventCallback('onTap', [e, target]);
                }
                this.parent?.onPress(e);
            }, 200);
            this.lastTap = currentTime;
        }
    }

    onLongTap(e: SyntheticEvent): void {
        if(!e.propagationEnabled){
            return;
        }
        this.props.onLongTap && this.props.onLongTap(e);
        setTimeout(() => {
            this.props.target?.invokeEventCallback('onLongtap', [e, this.props.target]);
            this.parent?.onPressOut(e);
        }, 200);
        this.isLongTap = true;
    }
    
    onPressOut(e: SyntheticEvent): void {
        if(!e.propagationEnabled){
            return;
        } 
        this.props.onTouchEnd && this.props.onTouchEnd(e);
        setTimeout(() => {
            this.props.target?.invokeEventCallback('onTouchend', [e, this.props.target]);
            this.parent?.onPressOut(e);
        }, 200);
        this.isLongTap = false;
    }
    private setParent(parent: Tappable) {
        if (parent && this.parent !== parent)  {
            this.parent = parent;
        }
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
                this.onPress(new SyntheticEvent())
            },
            onLongPress:(e?: GestureResponderEvent) => this.onLongTap(new SyntheticEvent()),
            onPressOut:(e?: GestureResponderEvent) => this.onPressOut(new SyntheticEvent())
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
                    return preferences.enableRipple != false ? (
                        <ParentTappableContext.Consumer>{(parent) => {
                            this.setParent(parent);
                            return(
                                <ParentTappableContext.Provider value={this}>
                                    <TouchableRipple 
                                        rippleColor={this.props.disableTouchEffect ? "transparent" : this.props.rippleColor} 
                                        borderless={true} 
                                        {...commonProps}
                                        onLayout={this.props.onLayout}
                                    >
                                        <>{this.props.children}</>
                                    </TouchableRipple>
                                </ParentTappableContext.Provider>
                            )
                        }}</ParentTappableContext.Consumer>): (
                        //default value is 0.2
                        <TouchableOpacity 
                            activeOpacity={this.props.disableTouchEffect ? 1 : 0.2} 
                            onLayout={this.props.onLayout}
                            {...commonProps}
                        >
                            <>{this.props.children}</>
                        </TouchableOpacity>);
                }}
            </UIPreferencesConsumer>
            );
        }
        return (
            <View 
                style={this.props.styles}
                onLayout={this.props.onLayout}
            >
                {this.props.children}
            </View>);
    }
}
