import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLabel from '@wavemaker/rn-runtime/components/basic/label/label.component';

describe('Test Label component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLabel name="test_Label"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});