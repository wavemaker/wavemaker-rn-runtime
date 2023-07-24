import * as React from 'react';
import { TextStyle, View, Text, ViewStyle } from "react-native";

export interface LegendProps {
    data : [{
        name: string,
        color: string
    }];
    dotStyle?: ViewStyle;
    testStyle?: TextStyle;
    orientation?: 'vertical' | 'horizontal';
}

export const Legend = function(props: LegendProps) {
    return (
        <View style={[
        props.orientation === 'vertical' ?  {
            flexDirection: 'column',
            justifyContent: 'center'
        } : {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }]}>
            {props.data?.map(d => {
                return (
                <View key={d.name} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 4}}>
                    <View style={[{
                        width: 12,
                        height: 12
                    }, props.dotStyle, {
                        backgroundColor: d.color
                    }]}></View>
                    <Text style={[{ 
                        paddingLeft: 4
                    }, props.testStyle]}>{d.name}</Text>
                </View>);
            })}
        </View>
    );
};