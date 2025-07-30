import React, { useEffect, useState } from 'react';
import { Animated, TextStyle, Text, ViewStyle} from 'react-native';

import { Theme } from '@wavemaker/app-rn-runtime/styles/theme';

export const FloatingLabel = (props: {
    label?: string,
    style?: TextStyle & ViewStyle,
    moveUp: boolean,
  }) => {
    const width = (props.style?.width as number) || 160;
    const [labelPositionX] = useState(new Animated.Value(0));
    const [labelPositionY] = useState(new Animated.Value(0));
    const [labelScale] = useState(new Animated.Value(1));
    const fontSize = (props.style?.fontSize || 16);
    useEffect(() => {
      Animated.parallel([
        Animated.timing(labelPositionX, {
          toValue: props.moveUp ? -1 * 0.1 * width : 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(labelPositionY, {
          toValue: props.moveUp ? -1 * fontSize : 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(labelScale, {
          toValue: props.moveUp ? 0.8 : 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }, [props.moveUp]);
    return (
        <Animated.View style={[{
            position: 'absolute',
            zIndex: 1,
            width: width,
            transform: [
                {translateY: labelPositionY},
                {translateX: labelPositionX},
                {scale: labelScale}
            ]},
            props.style
        ]}
        pointerEvents="none">
          <Text
            style={Theme.BASE.getTextStyle(props.style)}
            ellipsizeMode="tail">
            {props.label}
          </Text>
        </Animated.View>
    );
  };
  