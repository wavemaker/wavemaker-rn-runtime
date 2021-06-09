import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import NavigationService from "@wavemaker/app-rn-runtime/core/navigation.service";

interface TappableProps {
    children?: any
    styles?: any;
    target: BaseComponent<any, any, any>;
    onTap?: (navigationService: NavigationService) => void;
    onDoubleTap?: (navigationService: NavigationService) => void;
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
        // Object.assign(target.props, this.props);
        if(delta < 200) {
            target.invokeEventCallback('onDoubletap', [null, target]);
        }
        target.invokeEventCallback.call(this,'onTap', [null, target]);
    }

    render() {
        if (this.props?.onTap || this.props?.onDoubleTap) {
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
