import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

const Animated: any = isWebPreviewMode() ? {} : require('react-native-reanimated');

export const CollapsiblePane = (props: {
    close: boolean,
    children: any
  }) => {
    const [height, setHeight] = useState(0);
    const offset = Animated.useSharedValue(0);
    offset.value = props.close ? 0 : 1;
    const onLayoutChange = (e: LayoutChangeEvent) => {
      setHeight((e.nativeEvent?.layout?.height || height || 100000000) + 1000);
    };
    const animatedStyles = Animated.useAnimatedStyle(() => {
      return {
        maxHeight: Animated.withTiming(offset.value * height)
      };
    });
    return (
        <Animated.default.View style={[{overflow: 'hidden'}, animatedStyles]}>
          <View onLayout={onLayoutChange}>
            {props.children}
          </View>
        </Animated.default.View>
      );
  };