import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLogin from '@wavemaker/app-rn-runtime/components/advanced/login/login.component';

describe('Test Login component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLogin name="test_Login"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});