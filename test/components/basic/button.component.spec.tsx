import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmButton from '@wavemaker/rn-runtime/components/basic/button/button.component';

describe('Test Button component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmButton name="test_Button"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});