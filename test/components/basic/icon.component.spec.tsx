import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

describe('Test Icon component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmIcon name="test_Icon"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});