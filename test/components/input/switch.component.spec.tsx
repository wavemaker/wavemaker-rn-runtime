import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmSwitch from '@wavemaker/app-rn-runtime/components/input/switch/switch.component';

describe('Test Switch component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmSwitch name="test_Switch"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});