import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCustom from '@wavemaker/app-rn-runtime/components/basic/custom/custom.component';

describe('Test Custom component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCustom name="test_Custom"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});