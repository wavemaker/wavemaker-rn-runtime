import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmDate from '@wavemaker/app-rn-runtime/components/input/epoch/date/date.component';

describe('Test Date component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmDate name="test_Date"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});