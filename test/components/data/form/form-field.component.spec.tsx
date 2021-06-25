import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmFormField from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';

describe('Test FormField component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmFormField name="test_FormField"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});