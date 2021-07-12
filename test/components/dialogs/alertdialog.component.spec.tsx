import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAlertdialog from '@wavemaker/app-rn-runtime/components/dialogs/alertdialog/alertdialog.component';

describe('Test Alertdialog component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAlertdialog name="test_Alertdialog"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});