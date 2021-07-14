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

export class Tappable extends React.Component<TappableProps, any> {
    private lastPress = 0;

    constructor(props: any) {
        super(props);
    }

    onPress(e?: GestureResponderEvent): void {
        const delta = new Date().getTime() - this.lastPress;
        this.lastPress = this.lastPress > 0 ? 0: new Date().getTime();
        const target = this.props.target;
        // Object.assign(target.props, this.props);
        if(delta < 200) {
            this.props.onDoubleTap && this.props.onDoubleTap(e);
            target?.invokeEventCallback('onDoubletap', [null, target]);
        }
        this.props.onTap && this.props.onTap(e);
        target?.invokeEventCallback('onTap', [null, target]);
    }

    render() {
        const target = this.props.target;
        if (target?.props.onTap || target?.props.onDoubleTap || this.props.onTap || this.props.onDoubleTap) {
            return (
                <TouchableOpacity
                    style={this.props.styles}
                    onPress={() => this.onPress()}>
                    {this.props.children}
                </TouchableOpacity>
            );
        }
        return (<>{this.props.children}</>);
    }
}
