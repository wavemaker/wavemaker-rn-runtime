import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTabs from '@wavemaker/app-rn-runtime/components/container/tabs/tabs.component';

describe('Test Tabs component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTabs name="test_Tabs"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
