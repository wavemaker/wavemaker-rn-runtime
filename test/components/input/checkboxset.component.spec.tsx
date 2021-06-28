import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCheckboxset from '@wavemaker/app-rn-runtime/components/input/checkboxset/checkboxset.component';

describe('Test Checkboxset component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCheckboxset name="test_Checkboxset"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});