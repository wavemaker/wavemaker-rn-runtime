import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTextarea from '@wavemaker/app-rn-runtime/components/input/textarea/textarea.component';

describe('Test Textarea component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTextarea name="test_Textarea"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
