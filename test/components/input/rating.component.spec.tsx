import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmRating from '@wavemaker/app-rn-runtime/components/input/rating/rating.component';

describe('Test Rating component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmRating name="test_Rating"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});