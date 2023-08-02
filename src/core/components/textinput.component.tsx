import React, { ForwardedRef, useCallback, useRef, useState } from 'react';
import { Platform, TextInput, TextInputProps } from 'react-native';

interface SelectRange {
    start: number,
    end: number
}

export const WMTextInput = React.forwardRef((props: (TextInputProps & {allowContentSelection: boolean}), ref: ForwardedRef<TextInput>) => {
    const [selectRange, setSelectRange] = useState<SelectRange>(null as any);
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
    return (
        <TextInput 
            {...props}
            ref={ref}
            selection={selectRange}
            onSelectionChange={onSelectionChange}
            caretHidden={!!selectRange?.end}
            onChangeText={(text) => {
                props.onChangeText && props.onChangeText(text);
                onChangeText(text);
            }}
            contextMenuHidden={!props.allowContentSelection}>    
        </TextInput>
    );
});