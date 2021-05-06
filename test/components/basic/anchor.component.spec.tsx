import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAnchor from '@wavemaker/rn-runtime/components/basic/anchor/anchor.component';

describe('Test Anchor component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAnchor name="test_Anchor"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});