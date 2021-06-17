import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmDatetime from '@wavemaker/app-rn-runtime/components/input/epoch/datetime/datetime.component';

describe('Test Datetime component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmDatetime name="test_Datetime"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});