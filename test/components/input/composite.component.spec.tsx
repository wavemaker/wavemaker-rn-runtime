import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmComposite from '@wavemaker/app-rn-runtime/components/input/composite/composite.component';

describe('Test Composite component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmComposite name="test_Composite"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});