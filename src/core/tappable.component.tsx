import React from "react";
import { TouchableOpacity } from "react-native";

interface TappableProps {
    onTap: Function;
    onDoubleTap: Function;
    children?: any
}

export class Tappable extends React.Component<TappableProps, any> {
    private lastPress = 0;

    constructor(props: any) {
        super(props);
    }
    
    onPress() {
        const delta = new Date().getTime() - this.lastPress;
        this.lastPress = this.lastPress > 0 ? 0: new Date().getTime();
        if(delta < 200) {
            //@ts-ignore
            this.props.onDoubleTap && this.props.onDoubleTap();
        }
        //@ts-ignore
        this.props.onTap && this.props.onTap();
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.onPress()}>
                {this.props.children}
            </TouchableOpacity>
        );
    }
}