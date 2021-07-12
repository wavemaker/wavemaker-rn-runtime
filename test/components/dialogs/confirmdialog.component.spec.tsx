import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmConfirmdialog from '@wavemaker/app-rn-runtime/components/dialogs/confirmdialog/confirmdialog.component';

describe('Test Confirmdialog component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmConfirmdialog name="test_Confirmdialog"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});