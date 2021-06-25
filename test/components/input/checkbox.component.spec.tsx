import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCheckbox from '@wavemaker/app-rn-runtime/components/input/checkbox/checkbox.component';

describe('Test Checkbox component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCheckbox name="test_Checkbox"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});