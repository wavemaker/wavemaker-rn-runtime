import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmContent from '@wavemaker/rn-runtime/components/page/content/content.component';

describe('Test Content component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmContent name="test_Content"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});