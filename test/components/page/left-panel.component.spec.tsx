import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLeftPanel from '@wavemaker/app-rn-runtime/components/page/left-panel/left-panel.component';

describe('Test LeftPanel component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLeftPanel name="test_LeftPanel"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});