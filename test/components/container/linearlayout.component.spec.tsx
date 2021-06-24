import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLinearlayout from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayout.component';

describe('Test Linearlayout component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLinearlayout name="test_Linearlayout"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});