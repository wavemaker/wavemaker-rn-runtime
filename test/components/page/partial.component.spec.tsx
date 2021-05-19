import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPartial from '@wavemaker/app-rn-runtime/components/page/partial/partial.component';

describe('Test Partial component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPartial name="test_Partial"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});