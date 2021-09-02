import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmFormBody from '@wavemaker/app-rn-runtime/components/data/form/form-body/form-body.component';

describe('Test FormBody component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmFormBody name="test_FormBody"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});