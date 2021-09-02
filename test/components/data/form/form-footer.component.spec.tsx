import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmFormFooter from '@wavemaker/app-rn-runtime/components/data/form/form-footer/form-footer.component';

describe('Test FormFooter component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmFormFooter name="test_FormFooter"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});