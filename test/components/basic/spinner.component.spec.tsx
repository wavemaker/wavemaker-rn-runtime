import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmSpinner from '@wavemaker/rn-runtime/components/basic/spinner/spinner.component';

describe('Test Spinner component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmSpinner name="test_Spinner"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});