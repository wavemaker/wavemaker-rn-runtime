import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPageContent from '@wavemaker/rn-runtime/components/page/page-content/page-content.component';

describe('Test PageContent component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPageContent name="test_PageContent"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});