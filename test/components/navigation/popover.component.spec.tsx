import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPopover from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.component';

describe('Test Popover component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPopover name="test_Popover"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});