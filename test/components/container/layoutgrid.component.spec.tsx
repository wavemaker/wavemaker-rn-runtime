import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLayoutgrid from '@wavemaker/rn-runtime/components/container/layoutgrid/layoutgrid.component';

describe('Test Layoutgrid component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLayoutgrid name="test_Layoutgrid"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});