import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmSearch from '@wavemaker/app-rn-runtime/components/basic/search/search.component';

describe('Test Search component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmSearch name="test_Search"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
