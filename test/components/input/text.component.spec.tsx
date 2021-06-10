import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmText from '@wavemaker/app-rn-runtime/components/input/text/text.component';

describe('Test Text component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmText name="test_Text"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});