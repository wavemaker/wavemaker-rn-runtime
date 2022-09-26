import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTabheader from '@wavemaker/app-rn-runtime/components/container/tabs/tabheader/tabheader.component';

describe('Test Tabheader component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTabheader name="test_Tabheader"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});