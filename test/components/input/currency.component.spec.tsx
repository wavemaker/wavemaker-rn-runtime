import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCurrency from '@wavemaker/app-rn-runtime/components/input/currency/currency.component';

describe('Test Currency component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCurrency name="test_Currency"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});