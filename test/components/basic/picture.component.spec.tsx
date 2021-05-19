import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

describe('Test Picture component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPicture name="test_Picture"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});