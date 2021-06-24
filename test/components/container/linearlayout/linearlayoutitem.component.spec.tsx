import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLinearlayoutitem from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayoutitem/linearlayoutitem.component';

describe('Test Linearlayoutitem component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLinearlayoutitem name="test_Linearlayoutitem"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});