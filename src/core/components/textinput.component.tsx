import React, { ForwardedRef, useCallback, useRef, useState } from 'react';
import { Platform, TextInput, TextInputProps, TextStyle } from 'react-native';
import { FloatingLabel } from './floatinglabel.component';
import MaskInput from 'react-native-mask-input';

interface SelectRange {
    start: number,
    end: number
}

export const WMTextInput = React.forwardRef((props: (TextInputProps & 
  {allowContentSelection: boolean, 
    floatingLabel: string
    floatingLabelStyle:  TextStyle,
    activeFloatingLabelStyle: TextStyle,
    mask: any, 
    showObfuscatedValue: any
    textChange: any,
    obfuscationCharacter: string
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

    const textChangeLocal = useCallback((text: string) => {        
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
        <MaskInput
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
          showObfuscatedValue={true}
          obfuscationCharacter={props.obfuscationCharacter}
          selection={selectRange}
          onSelectionChange={onSelectionChange}
          caretHidden={!!selectRange?.end}
          onChangeText={(masked, unmasked , obfuscated) => {
            if(props.mask){
              props.textChange && props.textChange(masked, unmasked)
              textChangeLocal(masked);
            }else if(props.showObfuscatedValue){
              props.textChange && props.textChange(obfuscated, unmasked)
              textChangeLocal(obfuscated);
            }else{
              props.textChange && props.textChange(unmasked)
              textChangeLocal(unmasked);
            }
          }}
          contextMenuHidden={!props.allowContentSelection}
        ></MaskInput>
      </>
    );
});