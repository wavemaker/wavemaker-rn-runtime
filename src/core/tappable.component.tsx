import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
            if(delta < 500) {
                this.props.onDoubleTap && this.props.onDoubleTap(e);
                target?.invokeEventCallback('onDoubletap', [syntheticEvent, target]);
            }
            this.props.onTap && this.props.onTap(e || syntheticEvent);
            target?.invokeEventCallback('onTap', [syntheticEvent, target]);
        }
    }

    render() {
        const target = this.props.target;
        if (target?.props.onTap || target?.props.onDoubletap || this.props.onTap || this.props.onDoubleTap) {
            return (
                <TouchableOpacity
                    style={this.props.styles}
                    onPress={() => !target?.props.disabled && this.onPress()}>
                    {this.props.children}
                </TouchableOpacity>
            );
        }
        return (<>{this.props.children}</>);
    }
}
