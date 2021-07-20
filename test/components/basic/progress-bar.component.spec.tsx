import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmProgressBar from '@wavemaker/app-rn-runtime/components/basic/progress-bar/progress-bar.component';

describe('Test ProgressBar component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmProgressBar name="test_ProgressBar"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});