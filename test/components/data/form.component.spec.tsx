import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmForm from '@wavemaker/app-rn-runtime/components/data/form/form.component';

describe('Test Form component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmForm name="test_Form"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});