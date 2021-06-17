import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTime from '@wavemaker/app-rn-runtime/components/input/epoch/time/time.component';

describe('Test Time component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTime name="test_Time"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});