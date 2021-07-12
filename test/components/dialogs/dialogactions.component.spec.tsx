import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmDialogactions from '@wavemaker/app-rn-runtime/components/dialogs/dialogactions/dialogactions.component';

describe('Test Dialogactions component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmDialogactions name="test_Dialogactions"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});