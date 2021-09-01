import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCamera from '@wavemaker/app-rn-runtime/components/device/camera/camera.component';

describe('Test Camera component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCamera name="test_Camera"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
