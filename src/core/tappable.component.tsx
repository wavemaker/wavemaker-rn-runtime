import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { GestureResponderEvent, Platform, View, TouchableOpacity } from "react-native";
import { get } from "lodash";
import injector from "./injector";
import { TouchableRipple } from "react-native-paper";
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

interface TappableState {
    measuredWidth: number;
    measuredHeight: number;
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

export class Tappable extends React.Component<TappableProps, TappableState> {
    private lastPress = 0;
    private lastTap = 0;
    private lastDoubleTap = 0;
    private isLongTap = false;
    private parent:Tappable = null as any;
   
    constructor(props: any) {
        super(props);
        this.state = {
            measuredWidth: 0,
            measuredHeight: 0
        };
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

    private handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        this.setState({
            measuredWidth: width,
            measuredHeight: height
        });
        
        // Call the original onLayout if provided
        if (this.props.onLayout) {
            this.props.onLayout(event);
        }
    };

    private setParent(parent: Tappable) {
        if (parent && this.parent !== parent)  {
            this.parent = parent;
        }
    }

    private calculateHitSlop(): any {
        const minTouchSize = Platform.OS === 'android' ? 48 : 44;
        const { measuredWidth, measuredHeight } = this.state;
        
        if (measuredWidth === 0 && measuredHeight === 0) {
            if (this.props.styles) {
                const styleObj = Array.isArray(this.props.styles) ? Object.assign({}, ...this.props.styles) : this.props.styles || {};
                let { width, height } = styleObj;
                width = typeof width === 'number' ? width : 0;
                height = typeof height === 'number' ? height : 0;
                
                const hitTop = height < minTouchSize ? (minTouchSize - height) / 2 : 0;
                const hitBottom = hitTop;
                const hitLeft = width < minTouchSize ? (minTouchSize - width) / 2 : 0;
                const hitRight = hitLeft;
                
                if (hitTop > 0 || hitLeft > 0) {
                    return { top: hitTop, bottom: hitBottom, left: hitLeft, right: hitRight };
                }
            }
            return undefined;
        }
        
        const hitTop = measuredHeight < minTouchSize ? (minTouchSize - measuredHeight) / 2 : 0;
        const hitBottom = hitTop;
        const hitLeft = measuredWidth < minTouchSize ? (minTouchSize - measuredWidth) / 2 : 0;
        const hitRight = hitLeft;
        
        if (hitTop > 0 || hitLeft > 0) {
            return { top: hitTop, bottom: hitBottom, left: hitLeft, right: hitRight };
        }
        
        return undefined;
    }

    render() {
        const target = this.props.target;
        const hitSlop = this.calculateHitSlop();
        const commonProps = {
            ...(Platform.OS === 'android' || Platform.OS === 'web') ? {
                accessibilityLabel: this.props.testID,
                testID: this.props.testID
            }: {
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
            onPressOut:(e?: GestureResponderEvent) => this.onPressOut(new SyntheticEvent()),
            onLayout: this.handleLayout,
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
                                        hitSlop={preferences.enableMinTouchArea !== false ? hitSlop : {}}
                                        onLayout={this.handleLayout}
                                    >
                                        <>{this.props.children}</>
                                    </TouchableRipple>
                                </ParentTappableContext.Provider>
                            )
                        }}</ParentTappableContext.Consumer>): (
                        //default value is 0.2
                        <TouchableOpacity 
                            activeOpacity={this.props.disableTouchEffect ? 1 : 0.2} 
                            onLayout={this.handleLayout}
                            {...commonProps}
                            hitSlop={preferences.enableMinTouchArea !== false ? hitSlop : {}}
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
                onLayout={this.handleLayout}
                {...this.props.accessibilityProps}
            >
                {this.props.children}
            </View>);
    }
}
