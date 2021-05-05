import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPage from '@wavemaker/rn-runtime/components//page/page.component';

describe('Test Page component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPage name="test_Page"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});