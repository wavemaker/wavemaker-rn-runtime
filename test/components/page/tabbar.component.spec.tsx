import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTabbar from '@wavemaker/app-rn-runtime/components/page/tabbar/tabbar.component';

describe('Test Tabbar component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTabbar name="test_Tabbar"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});