import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPanelContent from '@wavemaker/app-rn-runtime/components/container/panel/panel-content/panel-content.component';

describe('Test PanelContent component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPanelContent name="test_PanelContent"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});