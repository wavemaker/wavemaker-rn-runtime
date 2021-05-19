import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmListTemplate from '@wavemaker/app-rn-runtime/components/data/list/list-template/list-template.component';

describe('Test ListTemplate component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmListTemplate name="test_ListTemplate"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});