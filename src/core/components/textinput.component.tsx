import React, { ForwardedRef, useCallback, useRef, useState } from 'react';
import { Platform, TextInput, TextInputProps, TextStyle } from 'react-native';
import { FloatingLabel } from './floatinglabel.component';

interface SelectRange {
    start: number,
    end: number
}

export const WMTextInput = React.forwardRef((props: (TextInputProps & 
  {allowContentSelection: boolean, 
    floatingLabel: string
    floatingLabelStyle:  TextStyle,
    activeFloatingLabelStyle: TextStyle
  }), 
    ref: ForwardedRef<TextInput>) => {
    const [selectRange, setSelectRange] = useState<SelectRange>(null as any);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const value = useRef(props.value || '');
    
    const animateLabelText = props.floatingLabel && ( Platform.OS === 'web' ? Number(props.value?.length) > 0 : Number(props.defaultValue?.length) > 0);

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

    return (
      <>
        {props.floatingLabel ? (
          <FloatingLabel
            moveUp={!!(value.current || isInputFocused)}
            label={props.floatingLabel ?? props.placeholder} 
            style={{
              ...(props.floatingLabelStyle || []),
              ...(isInputFocused ? (props.activeFloatingLabelStyle || {}) : {})
            }}/>
        ) : null}
        <TextInput
          {...props}
          placeholder={props.floatingLabel ? '' : props.placeholder }
          style={props.style}
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
      </>
    );
});