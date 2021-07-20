import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmProgressCircle from '@wavemaker/app-rn-runtime/components/basic/progress-circle/progress-circle.component';

describe('Test ProgressCircle component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmProgressCircle name="test_ProgressCircle"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});