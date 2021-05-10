import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmList from '@wavemaker/rn-runtime/components/data/list/list.component';

describe('Test List component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmList name="test_List"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});