import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPartialContainer from '@wavemaker/app-rn-runtime/components/page/partial-container/partial-container.component';

describe('Test PartialContainer component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPartialContainer name="test_PartialContainer"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});