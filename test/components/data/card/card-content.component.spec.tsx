import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCardContent from '@wavemaker/app-rn-runtime/components/data/card/card-content/card-content.component';

describe('Test CardContent component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCardContent name="test_CardContent"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});