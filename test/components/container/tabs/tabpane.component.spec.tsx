import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTabpane from '@wavemaker/app-rn-runtime/components/container/tabs/tabpane/tabpane.component';

describe('Test Tabpane component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTabpane name="test_Tabpane"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});