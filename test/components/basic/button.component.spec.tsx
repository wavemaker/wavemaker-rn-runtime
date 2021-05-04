import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmButton from '@wavemaker/rn-runtime/components/basic/button.component';

describe('Test Button component', () => {
    test('Check validity of sample component', () => {
        const tree = renderer.create(<WmButton name="test_button" caption="test_label"/>).toJSON();
        expect(tree).toMatchSnapshot();
      });
    
    test('Check init callback', () => {
        const onInitFn = jest.fn((i) => {});
        renderer.create(<WmButton name="test_button" caption="test_label" onInit={onInitFn}/>);
        expect(onInitFn.mock.calls.length).toBe(1);
        const componentInstance = onInitFn.mock.calls[0][0];
        expect(componentInstance.caption).toEqual('test_label');
        componentInstance.caption = 'test_label_modified';
        expect(componentInstance.caption).toEqual('test_label_modified');
    });

    test('Check component events', () => {
        const eventListener = jest.fn((e, w) =>{} );
        let wrapper = shallow(<WmButton name="test_button" caption="test_label" onTap={eventListener}/>);
        const tp = wrapper.find(TouchableOpacity);
        expect(tp.length).toEqual(1);
        expect(eventListener.mock.calls.length).toBe(0);
        tp.get(0).props.onPress();
        expect(eventListener.mock.calls.length).toBe(1);
        expect(eventListener.mock.calls[0][1]).toStrictEqual(wrapper.instance());
      });
    
      test('Check destroy callback', () => {
        const onDestroyFn = jest.fn(() => {});
        const instance = renderer.create(<WmButton name="test_button" caption="test_label" onDestroy={onDestroyFn}/>);
        expect(onDestroyFn.mock.calls.length).toBe(0);
        instance.unmount();
        expect(onDestroyFn.mock.calls.length).toBe(1);
      });
});