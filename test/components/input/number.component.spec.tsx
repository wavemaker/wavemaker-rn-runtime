import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmNumber from '@wavemaker/app-rn-runtime/components/input/number/number.component';

describe('Test Number component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmNumber name="test_Number"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});