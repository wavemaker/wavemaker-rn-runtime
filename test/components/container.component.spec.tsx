import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmContainer from '@wavemaker/app-rn-runtime/components//container/container.component';

describe('Test Container component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmContainer name="test_Container"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});