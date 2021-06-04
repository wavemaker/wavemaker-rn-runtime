import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmNav from '@wavemaker/app-rn-runtime/components/navigation/nav/navitem.component';

describe('Test Nav component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmNav name="test_Nav"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
