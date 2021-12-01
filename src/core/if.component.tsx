import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export enum HideMode {
    DONOT_ADD_TO_DOM = 0,
    ADD_TO_DOM = 1
}

const styles = StyleSheet.create({
    hidden: {
        width: 0,
        height: 0,
        transform: [{ scale: 0 }] 
    },
    visible: {}
});

export const WmIf = ({condition = true, hideMode = 0, style, children} : {
    condition: boolean,
    hideMode: HideMode,
    style: ViewStyle,
    children: any}) => {
    if (hideMode === HideMode.ADD_TO_DOM) {
        React.Children.map
        return (<View style={[condition? styles.visible: styles.hidden, style]}>{children}</View>);
    } else if (condition) {
        return children;
    } else {
        return null;
    }
};