import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPanel from '@wavemaker/app-rn-runtime/components/container/panel/panel.component';

describe('Test Panel component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPanel name="test_Panel"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});