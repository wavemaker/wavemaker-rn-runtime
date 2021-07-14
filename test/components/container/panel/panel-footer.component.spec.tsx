import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPanelFooter from '@wavemaker/app-rn-runtime/components/container/panel/panel-footer/panel-footer.component';

describe('Test PanelFooter component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPanelFooter name="test_PanelFooter"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});