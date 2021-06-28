import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmToggle from '@wavemaker/app-rn-runtime/components/input/toggle/toggle.component';

describe('Test Toggle component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmToggle name="test_Toggle"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});