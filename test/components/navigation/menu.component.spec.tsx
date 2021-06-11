import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmMenu from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.component';

describe('Test Menu component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmMenu name="test_Menu"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
