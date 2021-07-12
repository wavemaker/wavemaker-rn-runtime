import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmDialog from '@wavemaker/app-rn-runtime/components/dialogs/dialog/dialog.component';

describe('Test Dialog component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmDialog name="test_Dialog"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});