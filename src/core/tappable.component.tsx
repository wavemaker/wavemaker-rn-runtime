import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { View, TouchableOpacity } from "react-native";

interface TappableProps {
    children?: any
    styles?: any;
    target: BaseComponent<any, any, any>
}

export class Tappable extends React.Component<TappableProps, any> {
    private lastPress = 0;

    constructor(props: any) {
        super(props);
    }
    
    onPress() {
        const delta = new Date().getTime() - this.lastPress;
        this.lastPress = this.lastPress > 0 ? 0: new Date().getTime();
        const target = this.props.target;
        if(delta < 200) {
            target.invokeEventCallback('onDoubletap', [null, target]);
        }
        target.invokeEventCallback('onTap', [null, target]);
    }

    render() {
        const target = this.props.target;
        if (target.props.onTap || target.props.onDoubleTap) {
            return (
                <TouchableOpacity
                    style={this.props.styles}
                    onPress={() => this.onPress()}>
                    {this.props.children}
                </TouchableOpacity>
            );
        }
        return (<View>{this.props.children}</View>);
    }
}