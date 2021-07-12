import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmDialogcontent from '@wavemaker/app-rn-runtime/components/dialogs/dialogcontent/dialogcontent.component';

describe('Test Dialogcontent component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmDialogcontent name="test_Dialogcontent"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});