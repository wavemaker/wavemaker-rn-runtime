import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmSelect from '@wavemaker/app-rn-runtime/components/input/select/select.component';

describe('Test Select component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmSelect name="test_Select"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});