import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmBottomsheet from '@wavemaker/app-rn-runtime/components/basic/bottomsheet/bottomsheet.component';

describe('Test Bottomsheet component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmBottomsheet name="test_Bottomsheet"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});