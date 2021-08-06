import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmChips from '@wavemaker/app-rn-runtime/components/input/chips/chips.component';

describe('Test Chips component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmChips name="test_Chips"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});