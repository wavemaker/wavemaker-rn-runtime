import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmWizard from '@wavemaker/app-rn-runtime/components/container/wizard/wizard.component';

describe('Test Wizard component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmWizard name="test_Wizard"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
