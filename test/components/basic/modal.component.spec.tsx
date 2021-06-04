import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmModal from '@wavemaker/app-rn-runtime/components/basic/modal/modal.component';

describe('Test Modal component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmModal name="test_Modal"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});