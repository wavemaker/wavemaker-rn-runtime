import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmButtongroup from '@wavemaker/app-rn-runtime/components/basic/buttongroup/buttongroup.component';

describe('Test Buttongroup component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmButtongroup name="test_Buttongroup"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});