import React, { ForwardedRef, useCallback, useRef, useState } from 'react';
import { Platform, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

interface SelectRange {
    start: number,
    end: number
}

export const WMTextInput = React.forwardRef((props: (TextInputProps & {allowContentSelection: boolean, label: string, isFloating: boolean, floatingStyle: AllStyle}), ref: ForwardedRef<TextInput>) => {
    const [selectRange, setSelectRange] = useState<SelectRange>(null as any);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const labelOffset = useSharedValue(0);
    const animateLabelText = props.isFloating && ( Platform.OS === 'web' ? Number(props.value?.length) > 0 : Number(props.defaultValue?.length) > 0);

    const value = useRef(props.value || '');
    const onSelectionChange = useCallback((e: any) => {
        if (Platform.OS !== 'android') {
            return;
        }
        const selection = e?.nativeEvent?.selection;
        if (!props.allowContentSelection
            && selection
            && selection.end - selection.start > 0) {
            setSelectRange({
                start: value.current.length + 2,
                end: value.current.length + 2
            });
        } else if (selectRange && selectRange.end > 0){
            setSelectRange(null as any);
        }
    }, [props.allowContentSelection, value.current]);
    const onChangeText = useCallback((text: string) => {
        value.current = text;
    }, []);

    let borderBottomColor: ViewStyle = {};

    // * change border color on focus
    if (isInputFocused) {
      borderBottomColor.borderBottomColor = ThemeVariables.INSTANCE.primaryColor;
    }

    const labelAnimatedStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY:
              isInputFocused || animateLabelText
                ? withTiming(labelOffset.value - 14, { duration: 200 })
                : withTiming(0, { duration: 200 }),
          },
          {
            translateX:
              isInputFocused || animateLabelText
                ? withTiming(labelOffset.value - 7, { duration: 200 })
                : withTiming(0, { duration: 200 }),
          },
          {
            scale:
              isInputFocused || animateLabelText
                ? withTiming(0.8, { duration: 200 })
                : withTiming(1, { duration: 200 }),
          },
        ],
      };
    });

    return (
      <View>
        {props.isFloating ? (
          <TouchableOpacity
            style={{ pointerEvents: 'none', position: 'absolute', zIndex: 1 }}
          >
            <Animated.Text
              style={[
                labelAnimatedStyles,
                props.floatingStyle,
                {
                  color:
                    borderBottomColor.borderBottomColor ??
                    ThemeVariables.INSTANCE.inputPlaceholderColor,
                },
              ]}
            >
              {props.label ?? props.placeholder}
            </Animated.Text>
          </TouchableOpacity>
        ) : null}

        <TextInput
          {...props}
          placeholder={props.isFloating ? isInputFocused ? props.placeholder : '' : props.placeholder}
          style={[
            props.style,
            borderBottomColor,
            {
              paddingTop: props.isFloating ? 12 : 0,
              minHeight: props.isFloating ? 56 : 42,
            },
          ]}
          onFocus={(e) => {
            props.onFocus?.(e);
            setIsInputFocused(true);
          }}
          onBlur={(e) => {
            props?.onBlur?.(e);
            setIsInputFocused(false);
          }}
          ref={ref}
          selection={selectRange}
          onSelectionChange={onSelectionChange}
          caretHidden={!!selectRange?.end}
          onChangeText={(text) => {
            props.onChangeText && props.onChangeText(text);
            onChangeText(text);
          }}
          contextMenuHidden={!props.allowContentSelection}
        ></TextInput>
      </View>
    );
});