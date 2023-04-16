import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { get } from "lodash";
import injector from "./injector";

interface TappableProps {
    children?: any
    styles?: any;
    target?: BaseComponent<any, any, any>;
    onTap?: (e: any) => void;
    onDoubleTap?: (e: any) => void;
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

    static CURRENT_EVENT: TapEvent = null as any;

    constructor(props: any) {
        super(props);
    }

    onPress(e?: GestureResponderEvent): void {
        const delta = new Date().getTime() - this.lastPress;
        this.lastPress = this.lastPress > 0 ? 0: new Date().getTime();
        const target = this.props.target;
        if (!Tappable.CURRENT_EVENT) {
            Tappable.CURRENT_EVENT = new TapEvent();
            setTimeout(() => {
                Tappable.CURRENT_EVENT = null as any;
            }, 10);
        }
        const syntheticEvent = Tappable.CURRENT_EVENT;
        if (syntheticEvent.propagationEnabled) {
            injector.FOCUSED_ELEMENT.get()?.blur();
            if(delta < 500) {
                this.props.onDoubleTap && this.props.onDoubleTap(e);
                setTimeout(() => {
                    target?.invokeEventCallback('onDoubletap', [syntheticEvent, target]);
                }, 200);
            }
            this.props.onTap && this.props.onTap(e || syntheticEvent);
            setTimeout(() => {
                target?.invokeEventCallback('onTap', [syntheticEvent, target]);
            }, 200);
        }
    }

    render() {
        const target = this.props.target;
        if (target?.props.onTap || target?.props.onDoubletap || this.props.onTap || this.props.onDoubleTap) {
            return (
                <TouchableOpacity disabled={get(target?.proxy, 'disabled')}
                    style={this.props.styles}
                    onPress={() => this.onPress()}>
                    {this.props.children}
                </TouchableOpacity>
            );
        }
        return (<View style={this.props.styles}>{this.props.children}</View>);
    }
}
