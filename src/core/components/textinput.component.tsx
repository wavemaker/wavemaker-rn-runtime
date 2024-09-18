import React, { ForwardedRef, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import { isArray } from 'lodash';
import IMask from 'imask';
import { FloatingLabel } from './floatinglabel.component';

interface SelectRange {
    start: number,
    end: number
}

const WmCursor = React.memo((props: {
  color: string,
  height: number
}) => {
  const opacityAnimation = useRef(new Animated.Value(0.5)).current;
  const runAnimation = useCallback(() => {
    Animated.timing(opacityAnimation, {
      toValue: 0.2,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(opacityAnimation, {
        toValue: 0.6,
        duration: 500,
        useNativeDriver: true
      }).start(runAnimation);
    });
  }, []);
  useEffect(() => {
    runAnimation();
  }, []);
  return (
    <Animated.View 
    testID="wm-custom-cursor"
    style={{
      backgroundColor: props.color,
      width: 2,
      marginHorizontal: 1,
      height: props.height,
      opacity: opacityAnimation
    }}></Animated.View>
  );
});

export const WMTextInput = React.forwardRef((props: (TextInputProps & 
  {allowContentSelection: boolean,
    displayformat: string,
    maskchar: string,
    floatingLabel: string
    floatingLabelStyle:  TextStyle,
    activeFloatingLabelStyle: TextStyle,
    customDisplayValue?: string
  }), 
    ref: ForwardedRef<TextInput>) => {
    const [selectRange, setSelectRange] = useState<SelectRange>(null as any);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [iMask, setIMask] = useState(null as any);
    const [displayCursor, setDisplayCursor] = useState(false);
    const value = useRef(props.value || '');
    const [x, forceUpdate] = useState(1);
    const [displayValue, setDisplayValue] = useState('');
    const element = useRef(null as any);
    // iMask initialization
    useEffect(() => {
      const iMask: any = props.displayformat ? new IMask.MaskedPattern({
        mask: props.displayformat,
        skipInvalid: true,
        lazy: false,
        definitions: {
            '9': /\d/,
            'A': /[a-zA-Z]/,
            'a': /[a-z]/,
            '*': /\w/
        }
      }) : null;
      if (iMask) {
        iMask.typedValue = value;
        setDisplayValue(iMask.displayValue)
        setIMask(iMask);
      }
    },[props.displayformat]);
    // set default value
    useEffect(() => {
      const defaultValue = props.defaultValue || props.value || '';
      if (defaultValue && !value.current) {
        value.current = defaultValue;
        onChangeText(defaultValue);
      }
    },[props.defaultValue, props.value]);
    // set cursor position in windows
    useEffect(() => {
      setTimeout(() => {
        if (Platform.OS === 'web' && (props.displayformat || props.maskchar)) {
          element?.current?.setSelectionRange(value.current.length, value.current.length);
        }
      }, 100);
    }, [value.current, props]);
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
    }, [props.allowContentSelection, value]);
    // when text changes
    const onChangeText = useCallback((text: string) => {
      if (!(iMask || props.maskchar)) {
        value.current = text;
        props.onChangeText && props.onChangeText(text);
        return;
      }
      let _value = value.current || '';
      if (value.current.length - text.length > 0) {
        _value = _value.substring(0, _value.length - (value.current.length - text.length));
      } else if (text.length - value.current.length > 0) {
        _value += text.slice(-1 * (text.length - value.current.length));
      }
      let formattedValue = _value;
      if(props.maskchar) {
        formattedValue = (_value.replace(/./g, props.maskchar));
      }
      if (iMask) {
        iMask.typedValue = _value;
        formattedValue = iMask.displayValue;
      }
      if (formattedValue !== displayValue) {
        value.current = _value;
        props.onChangeText && props.onChangeText(_value);
      }
      forceUpdate(x+ 1);
      setDisplayValue(formattedValue);
    }, [iMask, value, displayValue, props.onChangeText]);
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    const opts = {} as any;
    opts[valueExpr] = props.customDisplayValue ?? value.current;
    const textStyle = Object.assign({}, ...isArray(props.style) ? props.style: [props.style]);
    const hideInput = props.displayformat || props.maskchar;
    return (
      <>
        {props.floatingLabel ? (
          <FloatingLabel
            moveUp={!!(value.current || isInputFocused || displayValue)}
            label={props.floatingLabel ?? props.placeholder} 
            style={{
              ...(props.floatingLabelStyle || []),
              ...(isInputFocused ? (props.activeFloatingLabelStyle || {}) : {})
            }}/>
        ) : null}
        <TextInput
          {...props}
          {...hideInput || props.customDisplayValue ? opts: {}}
          placeholder={props.floatingLabel || displayValue ? '' : props.placeholder }
          style={[props.style, hideInput ? {
            color: 'transparent', 
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            zIndex: 1
          } : {}]}
          onFocus={(e) => {
            props.onFocus?.(e);
            setIsInputFocused(true);
            setDisplayCursor(true);
            element.current = e.target;
          }}
          onBlur={(e) => {
            props?.onBlur?.(e);
            setIsInputFocused(false);
            setDisplayCursor(false);
          }}
          ref={ref}
          selection={selectRange}
          onSelectionChange={onSelectionChange}
          caretHidden={!!selectRange?.end}
          onChangeText={(text) => {
            onChangeText(text);
          }}
          {...hideInput ? {
            selectionColor: 'transparent',
            cursorColor: 'transparent',
            onChange : () => {}
          }: {}}
          contextMenuHidden={!props.allowContentSelection}
        ></TextInput>
        {
          hideInput ? (
            <View style={[props.style, {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -1 * (textStyle.height || textStyle.minHeight || 0)
                + (textStyle.marginTop || 0)}]}>
              <Text style={{ 
                width: undefined,
                backgroundColor: 'transparent', 
                borderColor: 'transparent',
                padding: 0,
                display: 'flex',
                color: textStyle.color,
                fontFamily: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                fontWeight: textStyle.fontWeight
                }}>
                {displayValue}
              </Text>
              {
                (displayCursor && !props.displayformat) ? React.createElement(WmCursor, {
                  color: textStyle.color || '#000000',
                  height: textStyle.fontSize || 14
                }) : null
              }
            </View>
          ) : null
        }
      </>
    );
});