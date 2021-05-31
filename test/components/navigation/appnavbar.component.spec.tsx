import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAppNavbar from '@wavemaker/app-rn-runtime/components/navigation/appnavbar/appnavbar.component';

describe('Test Navbar component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAppNavbar name="test_Navbar" title=""/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
