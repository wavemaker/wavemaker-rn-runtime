import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmNavbar from '@wavemaker/app-rn-runtime/components/navigation/navbar/navbar.component';

describe('Test Navbar component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmNavbar name="test_Navbar"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
