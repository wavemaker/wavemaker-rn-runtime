import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';

describe('Test Message component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmMessage name="test_Message"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});